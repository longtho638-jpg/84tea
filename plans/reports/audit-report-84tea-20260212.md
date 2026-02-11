# Audit Report: apps/84tea Security Audit

**Date:** 2026-02-12
**Auditor:** Antigravity (Mekong-CLI)
**Scope:** `apps/84tea` codebase

## Executive Summary

The codebase is generally secure, utilizing modern best practices like Zod for validation, Supabase for backend security (RLS assumptions), and Next.js built-in protections. However, there are specific areas regarding XSS potential in training modules and rate limiting limitations that need attention.

## 1. Hardcoded Secrets

**Status:** ✅ **PASS** (with notes)

*   **Findings:** No hardcoded API keys or secrets (like `sk_live_...`) were found in the source code.
*   **Pattern:** The code correctly uses `process.env` for accessing sensitive keys (`SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_FACEBOOK_APP_ID`).
*   **Observation:** Multiple files (e.g., `src/app/api/contact/route.ts`, `src/lib/payment-utils.ts`) use a fallback pattern:
    ```typescript
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    ```
    *   **Risk:** If `SUPABASE_SERVICE_ROLE_KEY` is missing in a server-side environment, it falls back to the ANON key. While the ANON key is public, code expecting admin privileges (Service Role) might fail securely or, worse, attempt operations that RLS blocks, leading to confusing errors. It does *not* expose the Service Role key, which is good.

## 2. XSS Vulnerabilities

**Status:** ⚠️ **WARNING**

*   **Finding 1:** `src/app/[locale]/training/module-1/module-content.tsx` uses `dangerouslySetInnerHTML`.
    *   **Context:** Used to render lesson content: `dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, "<br/>") }}`.
    *   **Analysis:** Currently, `lesson.content` comes from a static object `moduleData` defined in the same file. **This is safe right now.**
    *   **Future Risk:** If `moduleData` is ever fetched from an API or DB where user input is possible, this becomes a critical XSS vector.
    *   **Recommendation:** Use a safe Markdown renderer (like `react-markdown`) instead of `dangerouslySetInnerHTML` + regex replacement.

*   **Finding 2:** `src/app/[locale]/layout.tsx` uses `dangerouslySetInnerHTML` for JSON-LD.
    *   **Context:** `dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}`.
    *   **Analysis:** Standard practice for SEO. Low risk as data is generated from structured constants.

## 3. Insecure Dependencies & Patterns

**Status:** ✅ **PASS** (with optimization notes)

*   **Input Validation:** Excellent usage of `zod` in `src/lib/validation.ts` to strictly validate API inputs (orders, franchise applications, contacts). This prevents Mass Assignment and basic Injection attacks.
*   **Cryptography:** `src/lib/payment-utils.ts` uses `crypto.timingSafeEqual` for webhook signature verification, preventing timing attacks.
*   **Rate Limiting:** `src/lib/rate-limit.ts` uses an in-memory `LRUCache`.
    *   **Limitation:** In serverless environments (Vercel), memory is not shared between lambda instances. An attacker could hit different instances to bypass limits.
    *   **Recommendation:** For high-scale production, move rate limiting to a shared store (Redis/KV) or use Edge Middleware rate limiting provided by the platform (e.g., Vercel KV).

## 4. Other Security Checks

*   **Middleware:** `src/middleware.ts` implements route protection checks (`isProtectedRoute`) and adds basic security headers (`X-Content-Type-Options`, `X-Frame-Options`) for API routes.
*   **Dependencies:** `package.json` dependencies are standard. No obvious malicious packages found.

## Recommendations

1.  **Refactor Training Content Rendering:** Replace `dangerouslySetInnerHTML` in `module-content.tsx` with a proper Markdown component to future-proof against XSS.
2.  **Enhance CSP:** Consider adding a robust Content Security Policy (CSP) header in `middleware.ts` to strictly control resource loading sources.
3.  **Strict Env Checks:** In server-side API routes, strictly require `SUPABASE_SERVICE_ROLE_KEY` and throw an error if missing, rather than falling back to `ANON_KEY`, to prevent silent privilege failures.
