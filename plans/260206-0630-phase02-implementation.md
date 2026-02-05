# 84TEA Implementation Plan (Binh Pháp Mapping)

> Updated: 2026-02-06 06:30
> Status: **Phase 02 - IN PROGRESS**

## 始計 (Initial Calculations) - Current State

### ✅ Phase 01 COMPLETED (2026-02-05)

| Task                    | Status  | Commit                   |
| ----------------------- | ------- | ------------------------ |
| Fix ESLint warnings     | ✅ DONE | 32b4756                  |
| TypeScript strict mode  | ✅ DONE | Already enabled          |
| Error boundaries        | ✅ DONE | ErrorBoundary wrapper    |
| Supabase initialization | ✅ DONE | client/server/middleware |
| Database types          | ✅ DONE | database.types.ts        |
| Product data migration  | ✅ DONE | server-products.ts       |
| Auth context            | ✅ DONE | auth-context.tsx         |

### 🔄 Phase 02 ACTION ITEMS (This Week)

**Priority 🔴 HIGH:**

1. [ ] **PayOS Integration** - VietQR payment for Vietnam market
2. [ ] **Supabase RLS Policies** - Secure database access
3. [ ] **Auth Components Polish** - Login/Register flows

**Priority 🟡 MEDIUM:** 4. [ ] **PWA Manifest** - Service worker, offline support 5. [ ] **Cart Persistence** - LocalStorage + Supabase sync 6. [ ] **Order API** - Create order endpoint

**Priority 🟢 LOW:** 7. [ ] **84tea Club UI** - Subscription landing section 8. [ ] **Loyalty Points Display** - User profile integration

---

## 作戰 (Waging War) - Implementation Priority

### Immediate Sprint (Today)

```
PayOS Integration → Cart Persistence → Order Create API
```

**Why PayOS First:**

- VietQR is primary payment method for Vietnam launch
- Already have PayOS endpoint (`/api/payos/create-payment`)
- Need to complete E2E checkout flow
