# Codebase Summary

## 1. Directory Structure

### `src/app` (App Router)
Main application routes and layouts.
- `layout.tsx`: Root layout with MD3 providers, fonts (Playfair/Inter), and CartProvider.
- `page.tsx`: Landing page composition.
- `globals.css`: Tailwind directives and CSS variables for MD3 theme.
- **Routes:**
  - `/products`: Product listing and detail pages (`[slug]`).
  - `/franchise`: Franchise info (`page.tsx`) and application form (`apply/page.tsx`).
  - `/club`: Member dashboard for profile and loyalty tracking.
  - `/checkout`: Checkout process (`page.tsx`) and success page (`success/page.tsx`).
  - `/about`, `/contact`, `/shipping`, `/refund`, `/privacy`, `/terms`: Static information pages.
  - `/ops`, `/training`: Operational and training resources (placeholders).
- **API Routes (`/api`):**
  - `/api/orders`: Order creation (POST) and listing (GET, rate-limited).
  - `/api/payment/create-link`: PayOS payment link generation with server-side price validation.
  - `/api/payment/webhook`: PayOS webhook handler (looks up by numeric `order_code`).
  - `/api/products`: Product catalog endpoint.

### `src/components` (UI Library)
- **`ui/`**: Atomic MD3 components.
  - `button.tsx`: Material Design buttons (Filled, Outlined, Text).
  - `card.tsx`: Surface containers with elevation.
  - `typography.tsx`: Text components mapping to MD3 type scale.
  - `input.tsx`, `select.tsx`, `textarea.tsx`: Form controls.
  - `logo.tsx`: Brand logo component.
- **`layout/`**: Structural components.
  - `header-navigation.tsx`: Responsive top bar and drawer trigger.
  - `footer-section.tsx`: Site footer.
- **`home/`**: Landing page sections.
  - `hero-section.tsx`: Main visual entry point.
  - `story-section.tsx`: Brand narrative.
  - `featured-products.tsx`: Highlighted items.
  - `benefits-section.tsx`, `process-section.tsx`: Informational grids.
- **`products/`**: E-commerce components.
  - `product-card.tsx`: Individual product display.
  - `product-filter.tsx`: Category filtering.
  - `product-gallery.tsx`: Image carousel.
  - `product-actions.tsx`: Add to cart logic.
- **`franchise/`**: Franchise portal components.
  - `franchise-hero.tsx`, `franchise-models.tsx`, `franchise-benefits.tsx`.
  - `franchise-form.tsx`: Application submission form.
- **`cart/`**: Shopping cart features.
  - `cart-drawer.tsx`: Slide-out cart UI.
  - `cart-button.tsx`: Floating trigger.
- **`loyalty/`**: Loyalty program components.
  - `tier-badge.tsx`: Visual representation of membership tier.
  - `points-card.tsx`: Dashboard widget for points balance.
  - `points-history-list.tsx`: List of point transactions.
- **`auth/`**: Authentication components.
  - `auth-modal.tsx`: Login/Signup dialog.
  - `profile-setup-form.tsx`: User profile completion.

### `src/lib` (Utilities & Logic)
- `cart-context.tsx`: React Context for cart state management (localStorage persistence).
- `auth-context.tsx`: Authentication state provider (Supabase Auth).
- `data/products-service.ts`: **Single source of truth** for product data. Queries Supabase with React `cache()` for deduplication. All product consumers (pages, sitemap, components) import from here.
- `payment-utils.ts`: Cart validation (`validateCartItems`) and payment event logging (`logPaymentEvent`).
- `payos.ts`: PayOS SDK client configuration.
- `order-state-machine.ts`: Order lifecycle state transitions.
- `rate-limit.ts`: In-memory rate limiter for API endpoint protection.
- `validation.ts`: Input validation utilities.
- `security-headers.ts`: Security header configuration.
- `utils.ts`: Helper functions (e.g., `cn` for class merging).
- `schemas/checkout.ts`: Zod schema for checkout form validation.

### `src/types` (Type Definitions)
- `database.types.ts`: Supabase-generated types for all tables (profiles, products, orders, payment_logs, loyalty_transactions).
- `product.ts`: Product domain types used across components.

### `src/data` (Static Content)
- `products.json`: Seed/fallback product data (canonical source is now Supabase via `products-service.ts`).

## 2. Key Technologies
- **Next.js 15**: App Router framework.
- **Tailwind CSS**: Utility-first styling.
- **Material Design 3**: Design system methodology.
- **TypeScript**: Static typing.
- **Supabase**: PostgreSQL database, authentication, and Row Level Security.
- **PayOS**: Vietnamese VIETQR payment gateway (bank transfers).
- **Lucide React**: Icons (supplementary).
- **Material Symbols**: Main icon set (via Google Fonts).
- **Framer Motion**: Page transitions and animations.

## 3. Configuration Files
- `tailwind.config.ts`: Custom theme extension for MD3 colors/fonts.
- `next.config.ts`: Next.js configuration.
- `tsconfig.json`: TypeScript compiler options.
- `eslint.config.mjs`: Linting rules.
