# 84TEA — SECURITY + PERFORMANCE DEEP AUDIT

> **Ngày:** 2026-02-11 | **Auditor:** Claude Code | **Phiên bản:** 1.0

---

## TỔNG QUAN ĐIỂM SỐ

| Hạng mục | Điểm | Trạng thái |
|----------|-------|------------|
| **SECURITY_SCORE** | **7.5/10** | 🟡 Khá — có 3 lỗ hổng cần fix |
| **RLS_STATUS** | **8/10** | 🟢 Tốt — 6/7 table có RLS, 1 table thiếu |
| **API_HARDENED** | **8/10** | 🟢 Tốt — validation + rate limit đầy đủ |
| **PERF_SCORE** | **7/10** | 🟡 Khá — image chưa tối ưu |
| **TỔNG** | **30.5/40** | 🟡 Khá — cần fix 5 vấn đề critical/high |

---

## 1. API ROUTES AUDIT (6 routes)

### 1.1 Bảng tổng hợp

| Route | Method | Zod | Rate Limit | Auth | Ghi chú |
|-------|--------|-----|------------|------|---------|
| `/api/contact` | POST | ✅ contactSchema | ✅ 10/min | ❌ Public | OK — form liên hệ |
| `/api/products` | GET | ❌ | ✅ 30/min | ✅ Admin role | OK |
| `/api/products` | POST | ✅ productSchema | ✅ 10/min | ✅ Admin role | OK |
| `/api/payment/webhook` | POST | ✅ webhookSchema | ❌ | ✅ PayOS signature | OK — webhook không cần rate limit |
| `/api/payment/create-link` | POST | ✅ paymentLinkSchema | ✅ strict 10/15min | ❌ Guest OK | ⚠️ Chấp nhận được cho guest checkout |
| `/api/franchise/apply` | POST | ✅ franchiseApplySchema | ✅ 5/min | ❌ Public | OK — form đăng ký |
| `/api/orders` | POST | ✅ orderSchema | ✅ strict 10/15min | ❌ Guest OK | ⚠️ Guest checkout |
| `/api/orders` | GET | ❌ | ✅ 60/min | ❌ **THIẾU AUTH** | 🔴 **CRITICAL** |

### 1.2 Phát hiện nghiêm trọng

#### 🔴 CRITICAL: Orders GET endpoint không có auth

**File:** `src/app/api/orders/route.ts:142-201`

- Bất kỳ ai có `orderId` hoặc `orderCode` đều xem được chi tiết đơn hàng
- Dùng `service_role_key` bypass RLS → trả về toàn bộ data gồm thông tin khách hàng
- Attacker có thể brute-force `orderCode` (numeric, predictable pattern: timestamp*1000+random)

**Khuyến nghị:** Thêm auth check hoặc giới hạn trả về field cho anonymous requests

#### 🟡 HIGH: Service Role Key fallback sang Anon Key

**Files:** `contact/route.ts:9`, `franchise/apply/route.ts:9`, `orders/route.ts:10`, `payment/webhook/route.ts:11`

```ts
process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
```

- Nếu `SERVICE_ROLE_KEY` không set, fallback sang `ANON_KEY` → hành vi không dự đoán được
- Nên throw error thay vì fallback

#### 🟡 HIGH: `generateNumericOrderCode()` có thể bị đoán

**File:** `src/app/api/orders/route.ts:28-32`

```ts
const timestamp = Date.now() % 1_000_000_000;
const random = Math.floor(Math.random() * 1000);
return timestamp * 1000 + random;
```

- Chỉ 1000 giá trị random → có thể brute-force orderCode trong 1 giây nếu biết timestamp
- Kết hợp với GET endpoint không auth → leak thông tin đơn hàng

### 1.3 Điểm tốt

- ✅ **Zod validation** trên tất cả POST endpoints
- ✅ **Rate limiting** đầy đủ (standard 60/min, strict 10/15min)
- ✅ **Server-side price validation** — chống price tampering
- ✅ **Idempotency** trên webhook (skip duplicate payments)
- ✅ **PayOS SDK v2 signature verification** cho webhook
- ✅ **Timing-safe comparison** trong `verifyPayOSSignature()`
- ✅ **Payment audit trail** qua `payment_logs` table

---

## 2. SUPABASE RLS AUDIT

### 2.1 Trạng thái RLS theo table

| Table | RLS Enabled | SELECT | INSERT | UPDATE | DELETE | Ghi chú |
|-------|------------|--------|--------|--------|--------|---------|
| `products` | ✅ | Public (in_stock=true) | Admin | Admin | Admin | OK |
| `orders` | ✅ | Own + Admin | Auth (own) | Service role | Service role | OK |
| `profiles` | ✅ | Public | Self (auth.uid=id) | Self + is_admin protection | ❌ Không policy | ⚠️ |
| `franchise_applications` | ✅ | Admin | Public (WITH CHECK true) | ❌ Không policy | ❌ Không policy | OK cho MVP |
| `payment_logs` | ✅ | Admin | Service role | Service role | Service role | OK |
| `loyalty_transactions` | ✅ | Own (auth.uid=user_id) | ❌ Chỉ service role | ❌ Không policy | ❌ Không policy | OK |
| `contact_messages` | ❓ **KHÔNG CÓ MIGRATION** | ❓ | ❓ | ❓ | ❓ | 🔴 **CRITICAL** |

### 2.2 Phát hiện

#### 🔴 CRITICAL: `contact_messages` table thiếu RLS migration

- Table được dùng trong `src/app/api/contact/route.ts:35`
- Không có migration file nào tạo hoặc enable RLS cho table này
- Nếu RLS không enabled → bất kỳ authenticated user nào truy cập trực tiếp Supabase cũng đọc được tất cả messages

#### 🟡 HIGH: 3 pattern khác nhau cho admin check

| Pattern | Nơi sử dụng |
|---------|-------------|
| `profiles.role = 'admin'` | `20260206120000_apply_rls.sql` (API routes products) |
| `profiles.is_admin = true` | `20260206_rls_policies.sql` (original migration) |
| `auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'` | `20260207_create_products_table.sql`, `20260208_orders.sql` |

- **3 cách check admin khác nhau** → risk: user có role='admin' nhưng không có is_admin=true, hoặc ngược lại
- Migration mới nhất dùng JWT metadata, migration cũ dùng profiles table
- API routes (`products/route.ts`) dùng `profiles.role` → khác với RLS policies dùng JWT metadata

**Khuyến nghị:** Thống nhất 1 pattern duy nhất, recommend dùng `profiles.role = 'admin'` và sửa lại RLS policies

#### 🟢 GOOD: profiles UPDATE có protection chống self-promote

```sql
is_admin IS NOT DISTINCT FROM (SELECT is_admin FROM profiles WHERE id = auth.uid())
```

User không thể tự set `is_admin = true` qua direct DB update

---

## 3. .env.example AUDIT

### 3.1 Danh sách biến

| Biến | Có trong .env.example | Required | Ghi chú |
|------|----------------------|----------|---------|
| NEXT_PUBLIC_SITE_URL | ✅ | ✅ | |
| NEXT_PUBLIC_SUPABASE_URL | ✅ | ✅ | |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✅ | ✅ | |
| SUPABASE_SERVICE_ROLE_KEY | ✅ | ✅ | |
| PAYOS_CLIENT_ID | ✅ | ✅ | |
| PAYOS_API_KEY | ✅ | ✅ | |
| PAYOS_CHECKSUM_KEY | ✅ | ✅ | |
| NEXT_PUBLIC_FACEBOOK_APP_ID | ✅ | ❌ Optional | |
| NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION | ✅ | ❌ Optional | |
| NEXT_PUBLIC_HUB_API_URL | ✅ | ❌ Optional | |
| NEXT_PUBLIC_HUB_CLIENT_ID | ✅ | ❌ Optional | |

**Verdict:** ✅ Đầy đủ — tất cả biến cần thiết đều có trong .env.example

### 3.2 .gitignore check

- ✅ `.env*` được ignore (trừ `.env.example`)
- ✅ `*.pem` được ignore
- ✅ Không có secrets hardcoded trong source code (chỉ `process.env` references)

---

## 4. SECURITY HEADERS AUDIT

### 4.1 Headers đã cấu hình

| Header | Giá trị | Đánh giá |
|--------|---------|----------|
| HSTS | `max-age=63072000; includeSubDomains; preload` | ✅ 2 năm, có preload |
| X-Frame-Options | `DENY` | ✅ |
| X-Content-Type-Options | `nosniff` | ✅ |
| X-XSS-Protection | `1; mode=block` | ✅ (legacy nhưng OK) |
| Referrer-Policy | `strict-origin-when-cross-origin` | ✅ |
| Permissions-Policy | `camera=(), microphone=(), geolocation=()` | ✅ |
| CSP | Đầy đủ directives | ⚠️ Có `unsafe-eval` + `unsafe-inline` |
| X-DNS-Prefetch-Control | `on` | ✅ |
| X-Powered-By | Disabled (`poweredByHeader: false`) | ✅ |

### 4.2 CSP Analysis

```
script-src 'self' 'unsafe-eval' 'unsafe-inline' ...
```

- ⚠️ `'unsafe-eval'` — có thể cần cho Next.js dev nhưng nên remove prod
- ⚠️ `'unsafe-inline'` — giảm hiệu quả CSP chống XSS
- ✅ `object-src 'none'` — chặn Flash/plugins
- ✅ `frame-ancestors 'none'` — chống clickjacking
- ✅ `upgrade-insecure-requests` — chỉ trong production

---

## 5. PERFORMANCE AUDIT

### 5.1 Image Optimization

| Hạng mục | Trạng thái | Chi tiết |
|----------|-----------|----------|
| Next/Image usage | ✅ | 45 lần sử dụng trong 15 files |
| Image formats | ✅ | AVIF + WebP configured |
| Image cache | ✅ | 1 năm TTL |
| Remote patterns | ✅ | Supabase + Unsplash |
| **Static PNGs** | 🔴 | **11MB PNGs trong public/** |

**Phát hiện:**
- 10+ ảnh PNG 600KB-1MB mỗi ảnh trong `public/images/`
- Tổng: **11MB** ảnh chưa tối ưu
- Ảnh lớn nhất: `highlands-origin.png` (1MB), `franchise/signage-night.png` (999KB)
- Chuyển sang WebP/AVIF giảm 60-80% → tiết kiệm ~7MB

### 5.2 Bundle & Build

| Hạng mục | Giá trị | Đánh giá |
|----------|---------|----------|
| Static chunks | 1.6MB | ✅ Chấp nhận được |
| Total static | 2.0MB | ✅ |
| Compression | ✅ Enabled | |
| removeConsole | ✅ Production only | |
| optimizePackageImports | ✅ lucide-react, framer-motion | |

### 5.3 Code Splitting & Lazy Loading

| Hạng mục | Trạng thái |
|----------|-----------|
| Dynamic imports | ✅ 5 files dùng `dynamic` hoặc `Suspense` |
| Route loading states | ✅ `loading.tsx` cho routes chính |
| PWA Service Worker | ✅ Aggressive caching |

### 5.4 Database Performance

| Hạng mục | Trạng thái |
|----------|-----------|
| Products indexes | ✅ slug, category, featured, in_stock |
| Orders indexes | ✅ order_code, user_id, status, payment_status |
| updated_at trigger | ✅ Tự động update |

### 5.5 Code Quality Metrics

| Metric | Kết quả | Đánh giá |
|--------|---------|----------|
| `console.log` | **0** | ✅ |
| `: any` types | **0** | ✅ |
| `@ts-ignore` | **0** | ✅ |
| `TODO/FIXME` | **0** | ✅ |
| Hardcoded secrets | **0** | ✅ |

---

## 6. MIDDLEWARE AUDIT

**File:** `src/middleware.ts`

- ✅ Protected routes: `/club`, `/ops`, `/training` — yêu cầu auth
- ✅ Redirect về locale root nếu chưa đăng nhập
- ✅ Security headers cho API routes
- ✅ Supabase session refresh
- ✅ i18n routing (vi/en)

---

## 7. ACTION ITEMS — ƯU TIÊN

### 🔴 P0 (Critical — fix ngay)

1. **Orders GET endpoint thiếu auth** — Thêm auth hoặc giới hạn fields trả về
2. **`contact_messages` table thiếu RLS** — Tạo migration enable RLS + policies
3. **Thống nhất admin check pattern** — Chọn 1 pattern duy nhất, sửa tất cả migrations + routes

### 🟡 P1 (High — fix trong sprint)

4. **Service role key fallback** — Throw error thay vì fallback sang anon key
5. **`generateNumericOrderCode()`** — Dùng `crypto.randomInt()` thay vì `Math.random()`
6. **Static images** — Chuyển 11MB PNG → WebP/AVIF (tiết kiệm ~7MB)

### 🟢 P2 (Medium — plan roadmap)

7. **CSP tighten** — Remove `unsafe-eval`, thay `unsafe-inline` bằng nonces
8. **Composite DB indexes** — Thêm index cho queries thường dùng
9. **Error logging** — Thêm structured logging cho API errors (không chỉ payment)

---

## 8. TÓM TẮT

```
SECURITY_SCORE:  7.5/10 🟡  (3 critical/high issues)
RLS_STATUS:      8/10   🟢  (6/7 tables OK, 1 missing, admin pattern inconsistent)
API_HARDENED:    8/10   🟢  (Zod + rate limit đầy đủ, 1 endpoint thiếu auth)
PERF_SCORE:      7/10   🟡  (Bundle OK, images chưa optimize, PWA tốt)
CODE_QUALITY:    10/10  🟢  (0 any, 0 console, 0 ts-ignore, 0 TODO)
```

**Codebase nhìn chung tốt** — validation + rate limiting + RLS coverage đều solid. Cần fix 3 lỗ hổng P0 trước khi release production.
