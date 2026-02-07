# 84tea Production Upgrade - Binh Phap Strategic Plan

> **Mission**: Transform 84tea from MVP to production-grade e-commerce platform
> **Timeline**: 7 Phases | 14-21 days
> **Framework**: 孫子兵法 (Art of War) - Strategic, Methodical, Victory-Assured

---

## Strategic Overview

| Phase | Title | Priority | Duration | Status |
|-------|-------|----------|----------|--------|
| 01 | Audit & Foundation (始計) | CRITICAL | 2 days | Pending |
| 02 | Commerce & Payment (作戰) | CRITICAL | 3 days | Pending |
| 03 | Catalog & Data (謀攻) | HIGH | 3 days | Pending |
| 04 | Localization & SEO (軍形) | HIGH | 2 days | Pending |
| 05 | Mobile & PWA (兵勢) | MEDIUM | 2 days | Pending |
| 06 | Performance & Security (虛實) | CRITICAL | 3 days | Pending |
| 07 | Hub Connection (火攻) | LOW | 2 days | Pending |

**Total Estimated**: 17 days

---

## Current State Assessment

### Strengths (勢)
- ✅ Next.js 16 + React 19 (bleeding edge)
- ✅ Material Design 3 implementation
- ✅ Supabase integration with Auth
- ✅ PayOS payment gateway configured
- ✅ i18n infrastructure (next-intl)
- ✅ PWA manifest configured
- ✅ Loyalty system foundations

### Weaknesses (虛)
- ⚠️ Products in static JSON (not Supabase)
- ⚠️ No image optimization pipeline
- ⚠️ RLS policies unverified
- ⚠️ Security headers missing
- ⚠️ No Lighthouse audit baseline
- ⚠️ Mobile responsiveness gaps
- ⚠️ Metadata/SEO incomplete

---

## Phase Dependencies

```
Phase 01 (Foundation)
    ↓
Phase 02 (Commerce) + Phase 03 (Catalog) [Parallel]
    ↓
Phase 04 (i18n/SEO) + Phase 05 (Mobile) [Parallel]
    ↓
Phase 06 (Performance/Security)
    ↓
Phase 07 (Hub Integration)
```

---

## Phase Summaries

### Phase 01: 始計 (Initial Calculations)
**Objective**: Establish baseline, verify foundations, identify gaps
- Supabase connection health check
- RLS policy audit
- Environment variable validation
- Project structure verification
- Dependency audit (npm audit)

### Phase 02: 作戰 (Waging War)
**Objective**: Bulletproof commerce engine
- PayOS integration testing
- Checkout flow optimization
- Cart persistence strategy
- Order creation pipeline
- Webhook reliability

### Phase 03: 謀攻 (Strategic Attack)
**Objective**: Migrate to production data layer
- Product schema in Supabase
- Image optimization (WebP/AVIF)
- Migration from products-data.ts
- Admin seeding scripts
- Content management strategy

### Phase 04: 軍形 (Military Disposition)
**Objective**: Global reach, SEO dominance
- next-intl namespace refinement
- Metadata WOW protocol
- Sitemap generation
- Hreflang tags
- Social cards (OG/Twitter)

### Phase 05: 兵勢 (Energy)
**Objective**: Mobile-first excellence
- MD3 responsive audit
- PWA manifest refinement
- Offline capabilities
- Touch optimization
- Bottom navigation UX

### Phase 06: 虛實 (Weaknesses/Strengths)
**Objective**: Production-grade quality gates
- Lighthouse audit (>90 target)
- Security headers (CSP, HSTS)
- API route protection
- Rate limiting
- Error boundaries

### Phase 07: 火攻 (Attack by Fire)
**Objective**: Prepare for Mekong Hub SDK
- SDK placeholder structure
- Hub authentication stub
- Analytics integration points
- Multi-tenant foundations
- Future-proofing patterns

---

## Success Criteria

### Technical Gates
- [ ] Build passes with 0 errors
- [ ] Tests pass (unit + integration)
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 95
- [ ] Lighthouse SEO > 95
- [ ] npm audit: 0 high/critical vulnerabilities
- [ ] Type coverage: 100% (no `any`)

### Business Gates
- [ ] Checkout completes successfully (test transaction)
- [ ] i18n works (vi/en switching)
- [ ] Mobile renders correctly (320px-1920px)
- [ ] PWA installable on mobile
- [ ] Page load < 3s on 4G

### Quality Gates
- [ ] 0 console errors in production
- [ ] 0 TODO/FIXME comments
- [ ] All images optimized
- [ ] All metadata complete
- [ ] Error boundaries tested

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Supabase RLS misconfiguration | HIGH | Phase 01 comprehensive audit + manual testing |
| PayOS webhook failures | HIGH | Phase 02 retry logic + logging + test webhooks |
| Image optimization breaks layout | MEDIUM | Phase 03 gradual rollout + visual regression |
| i18n key mismatches | MEDIUM | Phase 04 automated validation script |
| Performance regression | HIGH | Phase 06 Lighthouse CI integration |
| Hub SDK breaking changes | LOW | Phase 07 loose coupling via interfaces |

---

## Rollback Strategy

Each phase includes:
1. **Git branch**: `phase-XX-[name]`
2. **Checkpoint commit**: Before destructive changes
3. **Feature flags**: For new capabilities
4. **Rollback script**: Automated revert procedure

---

## Next Steps

1. Read `phase-01-audit-foundation.md`
2. Execute Phase 01 checklist
3. Document findings in `plans/reports/phase-01-report.md`
4. Proceed to Phase 02 only when Phase 01 GREEN

---

**Created**: 2026-02-07
**Author**: docs-manager agent
**Framework**: Binh Phap + BMAD + ClaudeKit DNA
