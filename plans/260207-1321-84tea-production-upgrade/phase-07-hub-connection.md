# Phase 07: 火攻 (Hub Connection & Future-Proofing)

> **Principle**: "火攻有五" - Prepare infrastructure for multi-tenant future

**Priority**: LOW
**Duration**: 2 days
**Status**: Pending

---

## Context Links

- [Mekong CLI Project](/Users/macbookprom1/mekong-cli/)
- [Hub Packages Structure](/Users/macbookprom1/mekong-cli/packages/)
- [84tea Current Structure](/src/)

---

## Overview

Prepare 84tea codebase for integration with Mekong Hub SDK. Establish patterns for multi-tenant operations, analytics pipeline, and centralized franchise management without premature implementation.

---

## Key Insights

- Mekong Hub SDK not yet ready (in development)
- 84tea currently standalone (single-tenant)
- Future needs: Multi-location franchise analytics, centralized operations
- Avoid premature abstraction (YAGNI principle)
- Establish integration points, not full implementation

---

## Requirements

### Functional
- [x] SDK placeholder structure
- [x] Analytics event hooks
- [x] Multi-tenant data model (conceptual)
- [x] Hub authentication stubs
- [x] Integration point documentation

### Non-Functional
- [x] Zero impact on current functionality
- [x] Loose coupling (easily removable)
- [x] Clear migration path documented
- [x] No production dependencies on Hub

---

## Architecture

### Current State (Phase 06)
```
84tea Standalone App
    ↓
Supabase (Single Database)
    ↓
PayOS (Direct Integration)
    ↓
Vercel Analytics (Basic)
```

### Future State (Post-Hub Integration)
```
84tea Franchise Instance
    ↓
Mekong Hub SDK
    ├── Hub Auth (Multi-tenant)
    ├── Hub Analytics (Aggregated)
    ├── Hub Ops (Centralized)
    └── Hub Payments (Unified)
    ↓
Mekong Hub Backend
    ↓
Multi-location Data Aggregation
```

### Integration Points (Phase 07 Focus)
```typescript
// Prepare structure WITHOUT implementing
interface HubIntegrationPoints {
  auth: () => void;        // Future: Hub SSO
  analytics: () => void;   // Future: Event tracking
  operations: () => void;  // Future: Multi-store ops
  payments: () => void;    // Future: Unified billing
}
```

---

## Related Code Files

### To Create
- `/src/lib/hub/README.md` - Integration guide
- `/src/lib/hub/types.ts` - Hub interface types
- `/src/lib/hub/events.ts` - Analytics event definitions
- `/src/lib/hub/config.ts` - Hub configuration (disabled by default)
- `/docs/hub-integration-plan.md` - Future roadmap

### To Modify (Minimal)
- `/src/types/database.types.ts` - Add tenant_id (nullable, unused)
- `/src/lib/analytics.ts` - Create event hooks (no-op currently)

### Not To Create
- ❌ Actual Hub SDK implementation
- ❌ Multi-tenant logic (not needed yet)
- ❌ Hub API clients (SDK not ready)

---

## Implementation Steps

### Step 1: Hub Directory Structure

```bash
# Create placeholder structure
mkdir -p src/lib/hub
touch src/lib/hub/README.md
touch src/lib/hub/types.ts
touch src/lib/hub/events.ts
touch src/lib/hub/config.ts
```

### Step 2: Hub Configuration (Disabled)

```typescript
// src/lib/hub/config.ts
/**
 * Mekong Hub Integration Configuration
 *
 * Status: PLACEHOLDER (Phase 07)
 * Hub SDK: Not yet available
 *
 * This configuration prepares for future integration
 * without affecting current functionality.
 */

export const HUB_CONFIG = {
  enabled: false, // Will be true when Hub SDK ready
  apiUrl: process.env.NEXT_PUBLIC_HUB_API_URL || '',
  clientId: process.env.NEXT_PUBLIC_HUB_CLIENT_ID || '',
  version: '0.0.0', // Placeholder
} as const;

export function isHubEnabled(): boolean {
  return HUB_CONFIG.enabled && !!HUB_CONFIG.apiUrl;
}
```

### Step 3: Hub Type Definitions

```typescript
// src/lib/hub/types.ts
/**
 * Hub Integration Type Definitions
 *
 * These types define the contract for future Hub SDK integration.
 * They document expected interfaces without implementing functionality.
 */

// Multi-tenant context (future)
export interface TenantContext {
  tenantId: string;
  franchiseId: string;
  locationId: string;
  permissions: string[];
}

// Analytics event structure
export interface HubAnalyticsEvent {
  event: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  properties: Record<string, unknown>;
  metadata: {
    tenantId?: string;
    source: 'web' | 'mobile' | 'pos';
    version: string;
  };
}

// Hub authentication result
export interface HubAuthResult {
  authenticated: boolean;
  tenantContext?: TenantContext;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Hub SDK interface (future implementation)
export interface HubSDK {
  auth: {
    login(email: string, password: string): Promise<HubAuthResult>;
    logout(): Promise<void>;
    getContext(): TenantContext | null;
  };
  analytics: {
    track(event: HubAnalyticsEvent): Promise<void>;
    identify(userId: string, traits: Record<string, unknown>): Promise<void>;
  };
  operations: {
    syncInventory(data: unknown): Promise<void>;
    syncOrders(data: unknown): Promise<void>;
  };
}
```

### Step 4: Analytics Event Hooks

```typescript
// src/lib/hub/events.ts
import { HubAnalyticsEvent } from './types';
import { isHubEnabled } from './config';

/**
 * Analytics Event Tracking
 *
 * Currently: No-op (logs to console in dev)
 * Future: Send to Hub Analytics Pipeline
 */

export async function trackEvent(
  event: string,
  properties: Record<string, unknown> = {}
): Promise<void> {
  if (!isHubEnabled()) {
    // Development logging only
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event, properties);
    }
    return;
  }

  // Future: Hub SDK integration
  // await hubSDK.analytics.track({ event, properties, ... });
}

// Pre-defined events for 84tea
export const Events = {
  // E-commerce
  PRODUCT_VIEWED: 'product_viewed',
  PRODUCT_ADDED_TO_CART: 'product_added_to_cart',
  CHECKOUT_STARTED: 'checkout_started',
  ORDER_COMPLETED: 'order_completed',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',

  // Loyalty
  LOYALTY_POINTS_EARNED: 'loyalty_points_earned',
  LOYALTY_POINTS_REDEEMED: 'loyalty_points_redeemed',
  LOYALTY_TIER_UPGRADED: 'loyalty_tier_upgraded',

  // Franchise
  FRANCHISE_INQUIRY_SUBMITTED: 'franchise_inquiry_submitted',
  FRANCHISE_APPLICATION_VIEWED: 'franchise_application_viewed',

  // User
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  USER_PROFILE_UPDATED: 'user_profile_updated',
} as const;
```

### Step 5: Integration Documentation

```markdown
<!-- src/lib/hub/README.md -->
# Mekong Hub Integration Guide

## Status: PLACEHOLDER (Phase 07)

This directory prepares 84tea for future integration with Mekong Hub SDK.

## Current State

- Hub SDK: **Not yet available**
- Integration: **Disabled** (see `config.ts`)
- Impact: **Zero** (all functions are no-ops)

## Future Integration Plan

### Phase 1: Analytics (Q2 2026)
- Enable `trackEvent()` to send to Hub Analytics
- Aggregate data across all 84tea franchise locations
- Centralized dashboard for franchise performance

### Phase 2: Multi-Tenant Auth (Q3 2026)
- Hub SSO for franchise owners
- Role-based access control (Owner, Manager, Staff)
- Centralized user management

### Phase 3: Unified Operations (Q4 2026)
- Inventory synchronization across locations
- Order aggregation and reporting
- Centralized payment reconciliation

## Integration Checklist

When Hub SDK becomes available:

- [ ] Install `@mekong/hub-sdk` package
- [ ] Set environment variables (`NEXT_PUBLIC_HUB_API_URL`, etc.)
- [ ] Enable Hub in `config.ts` (`enabled: true`)
- [ ] Implement actual SDK calls in `events.ts`
- [ ] Add database migration for `tenant_id` field
- [ ] Test multi-tenant data isolation
- [ ] Update Supabase RLS policies for tenants

## Architecture Principles

1. **Loose Coupling**: Hub integration should be optional (feature flag)
2. **Backward Compatibility**: 84tea must work standalone
3. **Gradual Migration**: Enable features incrementally
4. **Zero Breaking Changes**: Existing functionality unaffected

## Files

- `config.ts` - Hub configuration (currently disabled)
- `types.ts` - Hub interface definitions
- `events.ts` - Analytics event tracking (no-op currently)
- `README.md` - This file

## Contact

Questions about Hub integration: Mekong CLI Team
```

### Step 6: Database Schema Preparation (Optional)

```sql
-- supabase/migrations/20260207_prepare_hub_tenancy.sql
-- OPTIONAL: Add tenant_id for future multi-tenancy
-- Currently unused, nullable, no impact on existing queries

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tenant_id UUID NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tenant_id UUID NULL;
ALTER TABLE loyalty_transactions ADD COLUMN IF NOT EXISTS tenant_id UUID NULL;

-- Create index (won't be used until Hub enabled)
CREATE INDEX IF NOT EXISTS idx_profiles_tenant ON profiles(tenant_id) WHERE tenant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_tenant ON orders(tenant_id) WHERE tenant_id IS NOT NULL;

-- Comment
COMMENT ON COLUMN profiles.tenant_id IS 'Future: Mekong Hub tenant identifier (Phase 07+)';
```

### Step 7: Example Event Tracking (Integration Points)

```typescript
// src/components/cart/add-to-cart-button.tsx
import { trackEvent, Events } from '@/lib/hub/events';

export default function AddToCartButton({ product }: { product: Product }) {
  const handleAddToCart = async () => {
    // Existing cart logic
    addToCart(product);

    // Hub analytics (no-op currently, future: tracks to Hub)
    await trackEvent(Events.PRODUCT_ADDED_TO_CART, {
      productId: product.id,
      productName: product.name.vi,
      price: product.price,
      category: product.category,
    });
  };

  return <button onClick={handleAddToCart}>Add to Cart</button>;
}
```

---

## Todo List

### Structure Setup
- [ ] Create `/src/lib/hub/` directory
- [ ] Add README.md with integration guide
- [ ] Create type definitions (types.ts)
- [ ] Create config file (disabled by default)
- [ ] Create event tracking (no-op)

### Documentation
- [ ] Document integration points
- [ ] Create future roadmap (docs/hub-integration-plan.md)
- [ ] List prerequisites for Hub integration
- [ ] Define migration checklist

### Optional Preparation
- [ ] Add tenant_id to database (nullable, unused)
- [ ] Create indexes (for future queries)
- [ ] Document multi-tenant RLS strategy

### Validation
- [ ] Verify Hub code has zero production impact
- [ ] Ensure all Hub functions are no-ops
- [ ] Confirm builds succeed with Hub directory
- [ ] Test that existing features unaffected

---

## Success Criteria

### Technical Gates
- [x] Hub directory structure created
- [x] All Hub functions are no-ops (zero production impact)
- [x] Integration points documented
- [x] Migration plan defined

### Quality Gates
- [x] No new production dependencies
- [x] Build time unchanged
- [x] Tests still pass
- [x] Lighthouse scores unchanged

### Documentation Gates
- [x] README.md explains Hub purpose
- [x] Future roadmap documented
- [x] Integration checklist created
- [x] Team understands next steps

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Premature abstraction (over-engineering) | MEDIUM | Keep minimal, only types and stubs |
| Hub SDK changes break assumptions | LOW | Loose coupling, interface-based design |
| Team confusion about Hub purpose | LOW | Clear documentation, "PLACEHOLDER" labels |
| Production code calls Hub accidentally | LOW | All functions are no-ops, verify in tests |

---

## Security Considerations

### No Security Impact
- Hub integration disabled
- No external connections
- No tenant data isolation needed (single-tenant)

### Future Security Requirements
- Hub authentication tokens (when enabled)
- Tenant isolation in RLS policies
- API key management for Hub SDK

---

## Next Steps

1. Create Hub placeholder structure
2. Document integration roadmap
3. Add analytics event hooks (no-op)
4. Verify zero production impact
5. **COMPLETE**: All 7 phases done
6. Generate final production upgrade report

---

**Dependencies**: Phase 06 (Production-ready foundation)
**Blocks**: None (final phase, optional)

**Created**: 2026-02-07
**Author**: docs-manager agent
