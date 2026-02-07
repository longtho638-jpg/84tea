# Operational Readiness Checklist & Handover

**Date**: 2026-02-07
**Status**: 🟡 READY FOR CONFIGURATION
**Executor**: fullstack-developer

## 1. 🛑 Critical Action Items (Blocking Production)

The application code is production-ready, but the environment configuration requires immediate attention before deployment.

### A. Environment Variables (`.env.local`)
The following variables are defined but **empty** or **missing** in your local environment. You must populate them in Vercel (or your hosting provider) and locally.

| Variable | Status | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ⚠️ Empty | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⚠️ Empty | Supabase Anon (Public) Key |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ Empty | Supabase Service Role Key (Server-side only) |
| `PAYOS_CLIENT_ID` | ⚠️ Empty | PayOS Client ID |
| `PAYOS_API_KEY` | ⚠️ Empty | PayOS API Key |
| `PAYOS_CHECKSUM_KEY` | ⚠️ Empty | PayOS Checksum Key |
| `NEXT_PUBLIC_SITE_URL` | ❌ Missing | Canonical URL (e.g., `https://84tea.vn`) |
| `NEXT_PUBLIC_FACEBOOK_APP_ID` | ❌ Missing | For Facebook OpenGraph integration |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | ❌ Missing | For Google Search Console |

**Action**:
1. Copy `.env.example` to `.env.local` (already done).
2. Fill in real values from Supabase and PayOS dashboards.
3. Add these variables to your Vercel Project Settings > Environment Variables.

### B. Database Setup
Once keys are configured, run the migration scripts to set up the database schema and RLS policies.

```bash
# 1. Apply Schema & RLS
npx ts-node scripts/apply-migration.ts

# 2. Seed Initial Products (Optional)
npx ts-node scripts/seed-products.ts
```

## 2. Performance & SEO Baseline

### Build Stats
- **Compilation**: ✅ Success (8.7s)
- **Static Generation**: ✅ 9/9 pages generated statically
- **Optimization**:
  - Images: `next/image` implemented for all product cards.
  - Fonts: `inter` and `playfair-display` self-hosted via `@fontsource`.
  - Scripts: Dynamic imports used for heavy homepage components.

### SEO Implementation
- **Metadata**: Dynamic `title`, `description`, `openGraph` for all routes.
- **Structured Data**: JSON-LD for Organization, WebSite, and Product.
- **Sitemap**: `/sitemap.xml` automatically generates from database products.
- **Robots**: `/robots.txt` configured to allow indexing.

## 3. Deployment Guide

### Vercel Deployment
1. **Push code** to GitHub/GitLab.
2. **Import project** in Vercel.
3. **Configure Build Settings**:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
4. **Add Environment Variables** (from Section 1A).
5. **Deploy**.

### Post-Deployment Verification
- [ ] Visit `https://your-domain.com/robots.txt` to verify it exists.
- [ ] Visit `https://your-domain.com/sitemap.xml` to verify product URLs.
- [ ] Test checkout flow (create order -> payment link -> success).
- [ ] Verify Supabase `orders` table updates after payment.

## 4. Maintenance

- **Adding Products**: Use the Supabase Dashboard or implement an Admin UI connecting to `/api/products`.
- **Content Updates**: Edit `messages/vi.json` and `messages/en.json` for text changes.
- **Monitoring**: Check Vercel Logs and Supabase Logs for runtime errors.
