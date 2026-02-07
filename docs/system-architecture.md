# System Architecture

## 1. High-Level Overview
The 84tea platform is built as a monolithic Next.js application (for MVP) designed for edge deployment. It prioritizes static generation (SSG) for content-heavy pages and client-side interactivity for the cart/checkout flow. The commerce layer connects to Supabase for persistent data and PayOS for Vietnamese bank transfer payments.

```mermaid
graph TD
    User[User] --> CDN[Edge Network (Vercel)]
    CDN --> NextJS[Next.js App Server]

    subgraph Frontend
        NextJS --> Pages[Pages / Layouts]
        NextJS --> Components[MD3 Components]
        NextJS --> Context[Cart Context]
    end

    subgraph API Routes
        NextJS --> OrdersAPI[/api/orders]
        NextJS --> PaymentAPI[/api/payment/create-link]
        NextJS --> WebhookAPI[/api/payment/webhook]
        NextJS --> ProductsAPI[/api/products]
    end

    subgraph Data Layer
        Pages --> ProductsService[products-service.ts (cache)]
        ProductsService --> Supabase[(Supabase DB)]
        OrdersAPI --> Supabase
        WebhookAPI --> Supabase
        Context --> LocalStorage[Browser LocalStorage]
    end

    subgraph External
        PaymentAPI --> PayOS[PayOS (VIETQR)]
        WebhookAPI --> PayOS
        NextJS --> Analytics[Vercel Analytics]
    end
```

## 2. Frontend Architecture
- **Framework:** Next.js 15 (App Router).
- **Rendering Strategy:**
  - **Static Site Generation (SSG):** Landing page, About, Franchise info, Product details (for SEO and performance).
  - **Client-Side Rendering (CSR):** Cart drawer, Checkout flow, Interactive filters (using `'use client'` directives).
- **State Management:** React Context API (`CartContext`) for shopping cart state, persisted to `localStorage`.

## 3. Styling Architecture
- **Engine:** Tailwind CSS.
- **Design System:** Material Design 3 (MD3).
- **Implementation:**
  - **CSS Variables:** Defined in `globals.css` (e.g., `--md-sys-color-primary`).
  - **Tailwind Config:** Maps utility classes to CSS variables (e.g., `bg-primary` -> `var(--md-sys-color-primary)`).
  - **Theming:** Supports Light/Dark mode via CSS variable switching (currently optimized for Light mode Brand identity).

## 4. Directory Structure
- `src/app`: Routes and Layouts.
- `src/app/api`: API route handlers (orders, payment, products, webhook).
- `src/components`: Reusable UI components.
  - `ui/`: Primitives (Button, Input, Typography).
  - `layout/`: Global structural components (Header, Footer).
  - `features/`: Domain-specific components (Cart, Franchise, Products).
- `src/lib`: Utilities, Context, Hooks, and Services.
  - `data/products-service.ts`: Single source of truth for product data (Supabase query with React `cache()`).
  - `rate-limit.ts`: In-memory rate limiter for API endpoints.
  - `payment-utils.ts`: Payment event logging and cart validation.
  - `order-state-machine.ts`: Order lifecycle state transitions.
- `src/types`: TypeScript type definitions including `database.types.ts` and `product.ts`.

## 5. Performance Optimization
- **Fonts:** `next/font/google` for self-hosted, zero-layout-shift fonts.
- **Images:** `next/image` for automatic optimization (WebP/AVIF) and lazy loading.
- **Code Splitting:** Automatic by Next.js App Router.
- **Icons:** Material Symbols font (Google Fonts) with `display=swap`.

## 6. Security
- **Input Validation:** TypeScript interfaces for all data structures.
- **Sanitization:** React automatically escapes content (JSX) to prevent XSS.
- **Headers:** Standard security headers (HSTS, X-Frame-Options) via `next.config.ts` and `security-headers.ts`.
- **Row Level Security (RLS):** Supabase policies ensure users can only access their own data (profiles, orders, loyalty transactions, payment logs).
- **Price Validation:** Server-side price verification rejects orders where client-submitted prices deviate > 1000 VND from DB prices (anti-tampering).
- **Rate Limiting:** In-memory rate limiter (`rate-limit.ts`) applied to sensitive endpoints (e.g., `GET /api/orders`).
- **No Demo Mode:** Payment flow requires live PayOS credentials; no fallback/demo bypass exists.

## 7. Database Schema (Key Entities)

### Orders
- **orders**: Stores completed and in-progress orders.
  - `order_code` (bigint): Server-generated numeric code for PayOS compatibility.
  - `user_id`: FK to `auth.users`, protected by RLS.
  - `status`: Order lifecycle state (pending, paid, cancelled, etc.).
  - `total_amount`: Server-validated total in VND.
  - `items` (jsonb): Snapshot of cart items at order time.

### Payment Logs
- **payment_logs**: Immutable audit trail for payment events.
  - `order_id`: FK to `orders`.
  - `event_type`: Webhook event classification (e.g., `PAYMENT_SUCCESS`, `PAYMENT_FAILED`).
  - `payload` (jsonb): Raw webhook payload for debugging.

### Loyalty System
- **Profiles Extension**:
  - `loyalty_points`: Current available balance for redemption.
  - `lifetime_points`: Cumulative points used for Tier calculation (never decreases).
  - `loyalty_tier`: Cached tier status (Bronze, Silver, Gold, Platinum).
- **Loyalty Transactions**:
  - Purpose: Immutable ledger of all point changes.
  - Fields: `amount` (integer), `type` (EARN_PURCHASE, REDEEM, etc.), `reference_id` (Order ID).
  - Logic: Trigger-based or application-level updates to Profile summaries.

### Products
- **products**: Canonical product catalog in Supabase.
  - Fields: `name`, `slug`, `description`, `price`, `category`, `origin`, `is_available`.
  - Queried exclusively via `products-service.ts` with React `cache()`.

### Migrations
- `20260206120000_apply_rls.sql`: Initial RLS policies.
- `20260206_loyalty_schema.sql`: Loyalty tables.
- `20260206_rls_policies.sql`: Extended RLS policies.
- `20260207_create_products_table.sql`: Products table.
- `20260208_create_orders_and_payment_logs.sql`: Orders and payment logs with RLS.
