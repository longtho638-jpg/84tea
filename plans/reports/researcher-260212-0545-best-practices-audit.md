# Research Report: 84tea Best Practices Audit
**Date:** 260212
**Author:** Antigravity Researcher
**Context:** Next.js 16, Jest, next-intl

## 1. Handling Circular Dependencies in Next.js

Circular dependencies occur when two or more modules depend on each other, creating a loop. Webpack/Next.js can sometimes handle them, but they often lead to `ReferenceError: Cannot access 'X' before initialization` or unexpected `undefined` imports.

### Detection Tools
*   **Madge (Recommended):** The gold standard for detecting circular dependencies.
    *   **Usage:** `npx madge --circular --extensions ts,tsx src/`
    *   **CI Integration:** Add to `package.json`: `"test:circular": "madge --circular --extensions ts,tsx src/ --warning"` to fail builds on circles.
*   **dpdm:** Faster alternative, supports TypeScript out of the box.
    *   **Usage:** `npx dpdm --circular src/`

### Architectural Best Practices
1.  **Avoid Barrel Files (Index.ts):**
    *   *Problem:* Re-exporting everything from `index.ts` often causes circles when internal components import from the parent index rather than siblings.
    *   *Solution:* Import directly from the file (e.g., `import { Button } from './Button'` instead of `import { Button } from './'`).
2.  **Shared/Common Module Pattern:**
    *   If `A` imports `B` and `B` imports `A`, extract the shared logic into a new module `C`. Both `A` and `B` can then import `C`.
3.  **Type-Only Imports:**
    *   In TypeScript, if a dependency is only for types, use `import type { ... }`. These are erased at runtime and break the runtime cycle.

## 2. Migrating `node:test` to Jest (Verification)

Since the codebase no longer contains `node:test` usage, the focus is on ensuring the Jest implementation is robust and follows Next.js 16 standards.

### Verification Checklist
1.  **Environment Configuration:**
    *   Ensure `jest.setup.ts` correctly imports `@testing-library/jest-dom`.
    *   Next.js 16 uses Server Components. Ensure tests for server components use appropriate mocking or are separated from client component tests.
2.  **Mocking & Spying:**
    *   `node:test` uses `mock.fn()`. Jest uses `jest.fn()`. Verify no lingering `node:test` mocks exist.
    *   Use `jest.spyOn()` instead of overwriting object methods directly.
3.  **Asynchronous Tests:**
    *   `node:test` handles async differently. Ensure all Jest tests interacting with promises use `async/await` and don't rely on `done` callbacks unless necessary (modern Jest discourages `done`).
4.  **Snapshot Migration:**
    *   If `node:test` snapshots existed, they are incompatible. Run `jest -u` to regenerate snapshots in Jest's format.

### Recommended Config Update
Ensure `jest.config.ts` ignores the heavy `node_modules` properly but transforms necessary ESM packages (like `next-intl` or `lucide-react` if they cause issues):

```typescript
transformIgnorePatterns: [
  '/node_modules/(?!(next-intl|use-intl|lucide-react)/)',
],
```

## 3. i18n Keys Management (next-intl)

Current status: `en.json` (1015 lines) vs `vi.json` (1003 lines). Mismatch detected.

### Strategy 1: Type-Safe Messages (Built-in)
Enable `next-intl` type safety to generate TS errors when keys are missing or invalid.

**Action:** Create/Update `src/global.d.ts` (or `i18n.d.ts`):
```typescript
import en from '../messages/en.json';

type Messages = typeof en;

declare global {
  // Use type safe message keys
  interface IntlMessages extends Messages {}
}
```
*Result:* Using `t('missing.key')` will now cause a compile-time TypeScript error.

### Strategy 2: Automated Syncing (Linting)
Use `eslint-plugin-next-intl` to enforce key presence across locales.

**Setup:**
1.  Install: `npm install --save-dev eslint-plugin-next-intl`
2.  Config `.eslintrc.json` or `eslint.config.mjs`:
    ```javascript
    // eslint.config.mjs
    // ...
    rules: {
      'next-intl/no-missing-keys': 'error' // Enforce all keys exist in all locales
    }
    ```

### Strategy 3: Sync Scripts (CI/CD)
For a large number of keys, a script is better than manual checking.

**Recommendation:** Add a `scripts/sync-i18n.ts` that:
1.  Reads `en.json` as the source of truth.
2.  Reads target locales (`vi.json`).
3.  Recursively checks for missing keys in targets.
4.  (Optional) Fills missing keys with `[MISSING]: {english_value}` placeholders.
5.  Fails the build (exit 1) if keys are missing (for CI).

## Unresolved Questions
*   Are there existing CI pipelines where we should inject the `madge` and `i18n-check` steps?
*   Do we prefer "fail on missing key" or "fallback to English" behavior in production?

## Sources
- [Next.js Testing Docs](https://nextjs.org/docs/app/building-your-application/testing/jest)
- [Madge (Circular Dependencies)](https://github.com/pahen/madge)
- [next-intl TypeScript Docs](https://next-intl-docs.vercel.app/docs/workflows/typescript)
