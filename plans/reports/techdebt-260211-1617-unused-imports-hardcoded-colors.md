# 84Tea Tech Debt Audit: Unused Imports & Hardcoded Colors

**Ngày:** 2026-02-11 | **Phạm vi:** `src/components/` (59 files) + `globals.css`

---

## 1. UNUSED IMPORTS

**Phương pháp:** `tsc --noEmit --noUnusedLocals --noUnusedParameters`

### Kết quả trong `src/components/`: 0 unused imports

**Tất cả 59 component files đều sạch.**

### Phát hiện ngoài components (tham khảo):

| File | Dòng | Import | Mức độ |
|------|------|--------|--------|
| `src/app/[locale]/terms/page.tsx` | 1 | `getTranslations` khai báo nhưng không dùng | Thấp |
| `src/lib/hub/events.ts` | 11 | `event` param không dùng | Thấp |
| `src/lib/hub/events.ts` | 12 | `properties` param không dùng | Thấp |

**Verdict: SẠCH** - Components không có unused imports.

---

## 2. HARDCODED COLORS

**Phương pháp:** Grep hex codes, rgb/rgba, hsl trong components + globals.css

### 2A. Trong Components

| File | Dòng | Màu | Mục đích | Đánh giá |
|------|------|-----|----------|----------|
| `auth/auth-modal.tsx` | 141 | `#4285F4` | Google logo - blue | CHẤP NHẬN (brand 3rd party) |
| `auth/auth-modal.tsx` | 145 | `#34A853` | Google logo - green | CHẤP NHẬN (brand 3rd party) |
| `auth/auth-modal.tsx` | 149 | `#FBBC05` | Google logo - yellow | CHẤP NHẬN (brand 3rd party) |
| `auth/auth-modal.tsx` | 153 | `#EA4335` | Google logo - red | CHẤP NHẬN (brand 3rd party) |
| `ui/floating-contact.tsx` | 33 | `bg-[#25D366]` | WhatsApp brand green | CHẤP NHẬN (brand 3rd party) |
| `products/product-card-glass.tsx` | 108 | `rgba(27,94,32,0.1)` | Primary green gradient | **CẦN SỬA** - dùng token |

### 2B. Trong globals.css

| Dòng | Giá trị | Mục đích | Đánh giá |
|------|---------|----------|----------|
| 194-199 | `rgba(0,0,0,...)` | Shadow elevation 0-5 | CHẤP NHẬN (shadow chuẩn) |
| 210 | `rgba(251,248,243,0.85)` | Glass light effect | **ƯU TIÊN THẤP** - duplicate surface |
| 216 | `rgba(26,28,26,0.85)` | Glass dark effect | **ƯU TIÊN THẤP** - duplicate surface |

### Không có CSS Modules

Project dùng **0 CSS module files**. Toàn bộ styling = Tailwind CSS + design tokens trong `globals.css`.

---

## 3. TÓM TẮT

| Hạng mục | Số lượng | Trạng thái |
|----------|----------|------------|
| Unused imports (components) | **0** | SẠCH |
| Unused imports (toàn bộ src) | **3** | Thấp, ngoài scope |
| Hardcoded colors - Brand 3rd party | **5** | CHẤP NHẬN |
| Hardcoded colors - Cần sửa | **1** | `product-card-glass.tsx:108` |
| Hardcoded colors - Ưu tiên thấp | **2** | Glass effect trong globals.css |
| CSS Modules | **0** | Không áp dụng |

---

## 4. HÀNH ĐỘNG ĐỀ XUẤT

### Ưu tiên cao
- [ ] **`product-card-glass.tsx:108`**: Thay `rgba(27,94,32,0.1)` bằng `var(--md-sys-color-primary)` với opacity

### Ưu tiên thấp
- [ ] `globals.css` glass effect: Cân nhắc dùng `color-mix()` với token thay vì hardcode rgba
- [ ] `src/app/[locale]/terms/page.tsx`: Xoá `getTranslations` import
- [ ] `src/lib/hub/events.ts`: Prefix `_` cho unused params hoặc xoá

---

**Score: 9.5/10** - Codebase rất sạch, chỉ 1 hardcoded color cần sửa trong components.
