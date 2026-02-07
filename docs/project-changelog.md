# Project Changelog

## [1.3.0] - 2026-02-08

### Production Upgrade (Phases 01-03)

#### Phase 01 - Audit & Foundation
- **Bug Fix**: `validateCartItems` was querying wrong columns (`name_vi`/`name_en`); corrected to use `name` and `slug`.
- **Bug Fix**: `logPaymentEvent` no longer silently swallows errors; failures now propagate correctly.
- **Type Safety**: Removed phantom fields (`image_url`, `energy_level`) from `database.types.ts` that did not exist in the actual schema.
- **Database Types**: Added `orders` and `payment_logs` table type definitions to `database.types.ts`.
- **Migration**: Created `20260208_create_orders_and_payment_logs.sql` with RLS policies for both tables.

#### Phase 02 - Commerce & Payment Hardening
- **Order Code**: Server now generates a numeric `order_code` for PayOS compatibility (PayOS requires numeric codes).
- **Price Validation**: Enforced server-side price validation with no client-side fallbacks; orders with price discrepancies > 1000 VND are rejected as tampering.
- **Webhook Fix**: PayOS webhook handler updated to look up orders by `order_code` instead of UUID.
- **Checkout Client**: Updated to consume `orderCode` from the API response for payment link creation.
- **Rate Limiting**: Added rate limiting on the `GET /api/orders` endpoint via `rate-limit.ts`.
- **Security**: Removed demo mode fallback from payment flow; all transactions now require live PayOS credentials.

#### Phase 03 - Catalog Data Consolidation
- **Single Source of Truth**: Consolidated 4 separate product data sources into 1 canonical service (`src/lib/data/products-service.ts`) using React `cache()`.
- **Dead Code Removal**: Removed 3 redundant files: `products-data.ts`, `data/products.ts`, `data/server-products.ts`.
- **Sitemap**: Updated `sitemap.ts` to import products from `products-service.ts`.

## [1.2.0] - 2026-02-06

### Added
- **Loyalty Program**: Comprehensive loyalty system with points tracking and tier progression.
- **Database Schema**: Added `loyalty_points` (profiles extension) and `loyalty_transactions` tables.
- **Club Dashboard**: Enhanced `/club` page with real-time points balance, tier status, and transaction history.
- **UI Components**:
  - `TierBadge`: Visual indicator of current membership tier (Bronze/Silver/Gold/Platinum).
  - `PointsCard`: Dashboard widget showing current balance and progress to next tier.
  - `PointsHistoryList`: Transaction log with date formatting and operation types.
- **Integration**: Added loyalty points display to the user navigation dropdown.

## [1.1.0] - 2026-02-06

### Added
- **Authentication**: Full Supabase Auth integration with OTP and Google login.
- **Payments**: PayOS integration for VIETQR bank transfers and automated webhook processing.
- **PWA Support**: Added `manifest.json`, Service Worker for offline support, and full icon set.
- **84tea Club**: New member area (`/club`) and profile management.
- **Database**: Supabase integration with Row Level Security (RLS) policies for Users and Orders.
- **Order System**: Dedicated `/api/orders` endpoint for order creation and tracking.

### Changed
- **Cart System**: Refactored `CartContext` to fully support backend order syncing and strict typing.
- **Checkout**: Enhanced checkout flow to support authenticated users and automatic form filling.

## [1.0.1] - 2026-02-06

### Fixed
- **Code Quality**: Resolved all ESLint warnings (removed unused imports in dialog.tsx).
- **Resilience**: Implemented `react-error-boundary` with a global fallback UI wrapper.
- **Type Safety**: Verified TypeScript strict mode compliance (0 errors).

## [1.0.0] - 2026-02-06

### Added
- **MD3 Redesign**: Complete overhaul of the design system to fully adhere to Material Design 3 standards (100% compliance).
- **Navigation System**: Implemented Top App Bar with scroll behavior, Navigation Drawer for mobile, Bottom Navigation, and Tabs.
- **Dark Mode**: Added full dark mode support with `next-themes` and MD3 dark color tokens.
- **Accessibility**: Achieved WCAG 2.1 AA compliance with focus rings, skip links, ARIA labels, and reduced motion support.
- **Performance**: Optimized images (AVIF/WebP), fonts (preconnect), and metadata for <3s load times.
- **SEO**: Added comprehensive SEO metadata, sitemap.xml, robots.txt, and OpenGraph tags.
- **Components**: Added `FilterChips`, `Snackbar`, `Dialog`, `Progress` indicators, and `ThemeToggle`.

### Changed
- **Typography**: Refined type scale to strictly match MD3 specs (Display/Headline/Title/Body/Label).
- **Colors**: Updated color palette to use CSS variables for dynamic Imperial Green & Gold Leaf theme switching.
- **Layout**: Migrated all pages to use the new `MainLayout` with responsive navigation patterns.
- **Build**: Upgraded to Next.js 16.1.6 with Turbopack for faster builds (4.1s).

## [0.1.0] - 2026-02-05

### Added
- **Project Scaffolding**: Initialized Next.js 15 application with TypeScript and Tailwind CSS.
- **Design System**: Implemented Material Design 3 (MD3) theme with "Imperial Green" and "Gold Leaf" brand colors.
- **Documentation**: Added PDR, Architecture, Roadmap, Codebase Summary, and Design Guidelines in `docs/`.
- **Layouts**: Created responsive Root Layout, Header with Navigation Drawer, and Footer.
- **Home Page**: Implemented Landing Page with Hero, Story, Featured Products, and Benefits sections.
- **Franchise Portal**: Created Franchise landing page (`/franchise`) with model showcase and application form.
- **Product System**: Added static product data, Product Listing, and Detail pages.
- **Cart System**: Implemented Shopping Cart using React Context, LocalStorage persistence, and UI Drawer.
- **Checkout**: Added Checkout page and Order Success confirmation page.
- **UI Components**: Built atomic MD3 components:
  - `Button` (Filled, Outlined, Text)
  - `Card` (Elevated, Filled)
  - `Input`, `Select`, `Textarea`
  - `Typography` (Playfair Display / Inter)

### Changed
- **Linting**: Fixed all ESLint errors including empty object types, unescaped entities, and React Hook dependencies.
- **Performance**: Optimized font loading with `next/font/google` and `display=swap`.

### Fixed
- **React Hooks**: Resolved `react-hooks/set-state-in-effect` warnings in CartContext and CartDrawer by deferring state updates.
