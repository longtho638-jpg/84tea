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
