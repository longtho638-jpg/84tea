# Technical Debt Analysis Report: 84tea

**Date:** 2026-02-12
**Scope:** `apps/84tea/src`

## 1. Code Comments (TODO/FIXME/HACK)
- **Status:** ✅ Clean
- **Findings:** No technical debt markers (`TODO`, `FIXME`, `HACK`) found in the codebase.

## 2. Dead Code Analysis
- **Status:** ✅ Fixed
- **Actions Taken:**
  - Removed unused component `src/components/checkout/payment-button.tsx`.
  - Removed unused file `src/lib/order-state-machine.ts`.
  - Refactored `src/lib/payment-utils.ts` to remove unused imports (`crypto`).

## 3. Circular Dependencies
- **Status:** ✅ Clean
- **Findings:** No circular dependencies detected using `madge`.

## 4. File Size & Complexity
The following files exceed the recommended 200-line limit and should be prioritized for refactoring:

| Lines | File Path | Recommendation |
|-------|-----------|----------------|
| 505 | `src/app/[locale]/training/module-1/module-content.tsx` | Split into sub-components |
| 503 | `src/app/[locale]/franchise/apply/apply-content.tsx` | Extract form sections |
| 450 | `src/app/[locale]/checkout/checkout-content.tsx` | Extract form/summary |
| 385 | `src/app/[locale]/ops/sop/page.tsx` | Split content |
| 374 | `src/app/[locale]/contact/contact-content.tsx` | Extract form |
| 355 | `src/lib/validation.test.ts` | Split tests |
| 329 | `src/app/[locale]/about/about-content.tsx` | Split content |
| 309 | `src/app/[locale]/training/page.tsx` | Split content |
| 269 | `src/app/[locale]/products/[slug]/page.tsx` | Extract logic |
| 251 | `src/types/database.types.ts` | Split types |

## 5. Code Quality & Patterns
- **Type Safety:** ✅ No explicit `any` types found.
- **Logging:** ✅ Console logs are properly wrapped in `src/lib/logger.ts`.
- **Naming:** ✅ File naming conventions (kebab-case) are followed.

## 6. High Priority Issues Identified
- **i18n Violation:** Hardcoded Vietnamese strings detected in `src/app/[locale]/franchise/apply/apply-content.tsx` (and potentially others).
  - *Rule Violation:* "KHÔNG ĐƯỢC để hardcoded strings trong JSX - tất cả phải dùng t()" (Rule 8).
  - *Action Required:* Extract strings to translation files (`messages/vi.json`, etc.) and use `useTranslations`.

## 7. Test Status
- **Status:** ✅ Passing
- **Actions Taken:**
  - Updated `jest.config.ts` to correctly ignore non-source directories.
  - Verified all 7 test suites pass.

## 8. Recommendations
1. **Prioritize i18n:** Address the hardcoded strings in `apply-content.tsx` immediately as it affects localization and violates project rules.
2. **Refactor Large Components:** Break down the 500+ line components into smaller, reusable pieces.
