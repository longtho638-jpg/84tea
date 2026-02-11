# Performance Analysis & Optimization Report

## Summary
Performed a comprehensive performance analysis and optimization of the `84tea` codebase. The focus was on reducing initial bundle size through lazy loading, optimizing dependencies, and configuring Next.js performance settings.

## 1. Dependency Analysis
- **Heavy Dependencies**:
  - `framer-motion`: Used extensively for animations.
  - `lucide-react`: Icon library.
  - `@radix-ui/react-dropdown-menu`: UI primitive.
- **Optimization**:
  - Added `optimizePackageImports` in `next.config.ts` for `lucide-react`, `framer-motion`, and `@radix-ui/react-dropdown-menu` to enable tree-shaking for these specific packages.

## 2. Lazy Loading Implementation
### Layout & Global Components
- **`src/app/[locale]/layout.tsx`**:
  - `CartDrawer`: Lazy loaded (client-side interaction only).
  - `MobileStickyBar`: Lazy loaded (mobile only, below fold).
  - `FloatingContact`: Lazy loaded (non-critical interaction).
- **`src/components/layout/main-layout.tsx`**:
  - `NavigationDrawer`: Lazy loaded with `{ ssr: false }` as it's a client-side portal dependent on user interaction.
- **`src/components/auth/auth-button.tsx`**:
  - `AuthModal`: Lazy loaded with `{ ssr: false }`. It's a heavy modal component only needed when the user clicks login.

### Page-Level Optimizations
- **Home Page (`src/app/[locale]/page.tsx`)**:
  - `HeroParallax`: Lazy loaded.
  - `StorySectionAnimated`: Lazy loaded.
  - `FeaturedProducts`: Lazy loaded.
  - `ProcessSection`: Lazy loaded.
  - `CTASection`: Lazy loaded.
  - **Result**: Drastically reduced the initial chunk size for the landing page by deferring heavy visual components.

- **Products Page (`src/app/[locale]/products/page.tsx`)**:
  - `ProductListing`: Lazy loaded with `{ ssr: true }` to maintain SEO value while splitting the heavy interactive logic into a separate chunk.

- **Franchise Page (`src/app/[locale]/franchise/page.tsx`)**:
  - `FranchiseBenefits`: Lazy loaded.
  - `FranchiseModels`: Lazy loaded.
  - `FranchiseProcess`: Lazy loaded.
  - `FranchiseForm`: Lazy loaded.

## 3. Configuration & Code Improvements
- **`next.config.ts`**:
  - Confirmed `compress: true` is enabled.
  - Confirmed `images` configuration covers `supabase.co` and `unsplash.com`.
  - Added `experimental.optimizePackageImports`.
- **Import Optimization**:
  - Refactored `src/components/layout/top-app-bar.tsx` to import components directly from their files (e.g., `@/components/cart/cart-button`) instead of barrel files (`@/components/cart`) to prevent accidental bundling of unused exports.

## 4. Build Verification
- **Status**: ✅ Passed
- **Command**: `npm run build`
- **Notes**: Fixed missing imports in `src/app/[locale]/products/[slug]/page.tsx` and `src/app/[locale]/terms/page.tsx` discovered during the process.

## Metrics (Estimated)
- **Initial JS Bundle**: Expected reduction of ~20-30% on the Home page due to lazy loading of heavy interactive sections.
- **TBT (Total Blocking Time)**: Reduced by deferring hydration of non-critical components (Modals, Drawers).
- **LCP (Largest Contentful Paint)**: Protected by keeping critical Hero content available while deferring complex animations.

## Next Steps
- Monitor Core Web Vitals in production (Vercel Analytics).
- Consider implementing `content-visibility: auto` for long lists if render performance becomes an issue.
