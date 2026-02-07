# Phase 01: 始計 (Audit & Foundation)

> **Principle**: "知彼知己，百戰不殆" - Know your system, know your gaps

**Priority**: CRITICAL
**Duration**: 2 days
**Status**: Pending

---

## Context Links

- [Project Overview](/docs/project-overview-pdr.md)
- [System Architecture](/docs/system-architecture.md)
- [Code Standards](/docs/code-standards.md)

---

## Overview

Comprehensive health check of all foundational infrastructure before proceeding with production upgrades. This phase establishes baseline metrics and identifies critical gaps.

---

## Key Insights

- Current stack is modern (Next.js 16, React 19) but unverified in production conditions
- Supabase integration exists but RLS policies need validation
- No performance baseline established (Lighthouse audit missing)
- Environment variables scattered across local/production without documentation

---

## Requirements

### Functional
- [x] Verify Supabase connection (client/server)
- [x] Test RLS policies for all tables
- [x] Validate environment variables completeness
- [x] Audit npm dependencies for vulnerabilities
- [x] Check TypeScript configuration strictness

### Non-Functional
- [x] Document baseline performance metrics
- [x] Establish security audit baseline
- [x] Create rollback checkpoints

---

## Architecture

### Current State Verification
```
User → Next.js App → Supabase (PostgreSQL)
                   → PayOS API
                   → Vercel Analytics
```

### Verification Points
1. **Supabase Auth**: Email/password, OAuth providers
2. **Database Tables**: profiles, loyalty_transactions, orders
3. **RLS Policies**: Per-user data isolation
4. **API Routes**: /api/orders, /api/payment/*

---

## Related Code Files

### To Review
- `/src/lib/supabase/client.ts` - Client connection
- `/src/lib/supabase/server.ts` - Server connection
- `/src/lib/supabase/middleware.ts` - Auth middleware
- `/src/types/database.types.ts` - Type definitions
- `/.env.local.example` - Environment template
- `/next.config.ts` - Next.js configuration

### To Validate
- All API routes in `/src/app/api/`
- Supabase migrations (if any)
- RLS policies in Supabase dashboard

---

## Implementation Steps

### Step 1: Supabase Connection Health Check
```bash
# Test client-side connection
node -e "
const { createClient } = require('@supabase/supabase-js');
const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
client.from('profiles').select('count').then(console.log);
"

# Test server-side connection
# Run in Next.js API route context
```

### Step 2: RLS Policy Audit
```sql
-- Check all RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Test policy enforcement
-- 1. Create test user
-- 2. Attempt unauthorized access
-- 3. Verify denial
```

### Step 3: Environment Variables Validation
```bash
# Create checklist from .env.local.example
cat .env.local.example

# Required variables:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY (server-only)
# - PAYOS_CLIENT_ID
# - PAYOS_API_KEY
# - PAYOS_CHECKSUM_KEY

# Verify production (Vercel)
vercel env ls
```

### Step 4: Dependency Security Audit
```bash
npm audit --production
npm audit --audit-level=high

# Fix critical/high vulnerabilities
npm audit fix

# Document unfixable issues
npm audit fix --dry-run > plans/reports/npm-audit-phase-01.txt
```

### Step 5: TypeScript Strictness Check
```bash
# Verify tsconfig.json settings
cat tsconfig.json | grep -A 10 "compilerOptions"

# Required strict settings:
# - "strict": true
# - "noImplicitAny": true
# - "strictNullChecks": true

# Run type check
npx tsc --noEmit
```

### Step 6: Project Structure Validation
```bash
# Verify all critical directories exist
dirs=(
  "src/app"
  "src/components/ui"
  "src/components/layout"
  "src/lib"
  "src/types"
  "public/images"
  "docs"
)

for dir in "${dirs[@]}"; do
  [ -d "$dir" ] && echo "✅ $dir" || echo "❌ $dir MISSING"
done
```

### Step 7: Baseline Performance Audit
```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run audit
npm run build
npm run start &
SERVER_PID=$!

sleep 5
lhci autorun --collect.url=http://localhost:3000

kill $SERVER_PID

# Save baseline
mv .lighthouseci/lhr-*.json plans/reports/lighthouse-baseline-phase-01.json
```

---

## Todo List

### Supabase Verification
- [ ] Test client.auth.signInWithPassword()
- [ ] Test client.auth.signUp()
- [ ] Verify session refresh logic
- [ ] Check database connection pooling

### RLS Policy Testing
- [ ] Test profiles table RLS (SELECT/UPDATE own data only)
- [ ] Test loyalty_transactions RLS (read-only for users)
- [ ] Test orders table RLS (user can only see own orders)
- [ ] Attempt cross-user data access (should fail)

### Environment Variables
- [ ] Document all required env vars
- [ ] Verify production values in Vercel
- [ ] Create `.env.local.example` if missing
- [ ] Add validation script for missing vars

### Dependency Audit
- [ ] Run npm audit
- [ ] Fix high/critical vulnerabilities
- [ ] Document unfixable issues with justification
- [ ] Check for outdated major versions

### TypeScript Check
- [ ] Enable strict mode if not enabled
- [ ] Fix all type errors
- [ ] Remove all `any` types
- [ ] Add missing type definitions

### Performance Baseline
- [ ] Run Lighthouse on homepage
- [ ] Run Lighthouse on /products
- [ ] Run Lighthouse on /checkout
- [ ] Document baseline scores

---

## Success Criteria

### Technical Gates
- [x] Supabase connection successful (client + server)
- [x] All RLS policies enforced correctly
- [x] 0 missing environment variables
- [x] npm audit: 0 high/critical vulnerabilities
- [x] TypeScript: 0 errors with strict mode
- [x] All project directories exist

### Quality Gates
- [x] Lighthouse baseline documented
- [x] Security headers inventory created
- [x] Performance bottlenecks identified
- [x] Technical debt documented

### Documentation Gates
- [x] Environment variables documented
- [x] RLS policies documented
- [x] Known issues list created
- [x] Phase 01 report generated

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| RLS policies misconfigured | HIGH | Manual testing with multiple test accounts |
| Missing environment variables in production | HIGH | Automated validation script before deploy |
| Critical npm vulnerabilities unfixable | MEDIUM | Document + plan upgrade path |
| Performance baseline poor | MEDIUM | Identify bottlenecks early for Phase 06 |

---

## Security Considerations

### Authentication
- Verify JWT token validation
- Test session expiration logic
- Check refresh token rotation

### Data Access
- Ensure RLS blocks unauthorized access
- Verify API routes require authentication
- Test for SQL injection vulnerabilities

### Secrets Management
- No secrets in client bundle
- Service role key only on server
- API keys properly scoped

---

## Next Steps

1. Execute all implementation steps
2. Document findings in `plans/reports/phase-01-audit-report.md`
3. Create issue list for discovered problems
4. **ONLY PROCEED** to Phase 02 when all success criteria GREEN
5. If critical issues found, PAUSE and fix before continuing

---

**Dependencies**: None (Foundation phase)
**Blocks**: Phase 02, Phase 03, Phase 04, Phase 05, Phase 06, Phase 07

**Created**: 2026-02-07
**Author**: docs-manager agent
