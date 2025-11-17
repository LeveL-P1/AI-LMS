# Authentication System Migration Checklist

## 🎯 Overview
This checklist helps you migrate from the old authentication system to the new professional system.

---

## Phase 1: Setup & Testing (30 minutes)

- [ ] Read `AUTH_QUICK_START.md`
- [ ] Read `PROFESSIONAL_AUTH_SUMMARY.md`
- [ ] Review `AUTH_SYSTEM.md` for full reference
- [ ] Start dev server: `npm run dev`
- [ ] Test onboarding page role selection
- [ ] Verify redirect to correct dashboard
- [ ] Check browser console for errors
- [ ] Check server console for logs

---

## Phase 2: API Routes Migration (1-2 hours)

### Update Imports
- [ ] Replace `import { requireRole } from '@/lib/auth/guards'`
- [ ] With `import { requireRole, isErrorResponse } from '@/lib/auth/fast-guards'`

### Update Guard Usage
For each API route using guards:

- [ ] Change `const user = await requireRole('ADMIN')`
- [ ] To add type guard: `if (isErrorResponse(user)) return user`
- [ ] Update to use `user.id`, `user.role`, `user.permissions`

### Example Migration
```typescript
// BEFORE
export async function POST(req: NextRequest) {
  const user = await requireRole('ADMIN')
  if (user instanceof NextResponse) return user
  
  // user could be NextResponse or AuthenticatedUser
  console.log(user.id)
}

// AFTER
export async function POST(req: NextRequest) {
  const user = await requireRole('ADMIN')
  if (isErrorResponse(user)) return user
  
  // user is guaranteed to be SessionUser
  console.log(user.id)
}
```

### Routes to Update
- [ ] `/api/admin/**` routes
- [ ] `/api/instructor/**` routes
- [ ] `/api/student/**` routes
- [ ] `/api/courses/**` routes
- [ ] `/api/enrollments/**` routes
- [ ] Any other protected API routes

---

## Phase 3: Client Components Migration (1-2 hours)

### Update Imports
- [ ] Replace `import { useAuth } from '@/hooks/useAuth'`
- [ ] With `import { useSession } from '@/hooks/useSession'`

### Update Hook Usage
For each component using auth:

- [ ] Change `const { user, hasRole } = useAuth()`
- [ ] To `const { user, hasRole, loading } = useSession()`
- [ ] Add loading state handling if needed

### Example Migration
```typescript
// BEFORE
export function AdminPanel() {
  const { user, hasRole } = useAuth()
  
  if (!user) return <div>Not authenticated</div>
  if (!hasRole('ADMIN')) return <div>Access denied</div>
  
  return <div>Admin Content</div>
}

// AFTER
export function AdminPanel() {
  const { user, loading, hasRole } = useSession()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not authenticated</div>
  if (!hasRole('ADMIN')) return <div>Access denied</div>
  
  return <div>Admin Content</div>
}
```

### Components to Update
- [ ] Admin dashboard
- [ ] Instructor dashboard
- [ ] Student dashboard
- [ ] Navigation/header components
- [ ] Any component checking user role/permissions

---

## Phase 4: Protected Routes Migration (1 hour)

### Update Imports
- [ ] Replace `import { RoleGuard } from '@/components/auth/RoleGuard'`
- [ ] With `import { ProtectedRoute, AdminOnly } from '@/components/auth/ProtectedRoute'`

### Update Component Usage
For each page using RoleGuard:

- [ ] Change `<RoleGuard roles={['ADMIN']}>`
- [ ] To `<ProtectedRoute roles={['ADMIN']} fallback={<AccessDenied />}>`
- [ ] Or use convenience: `<AdminOnly><Content /></AdminOnly>`

### Example Migration
```typescript
// BEFORE
import { RoleGuard } from '@/components/auth/RoleGuard'

export default function AdminPage() {
  return (
    <RoleGuard roles={['ADMIN']}>
      <AdminDashboard />
    </RoleGuard>
  )
}

// AFTER
import { AdminOnly } from '@/components/auth/ProtectedRoute'

export default function AdminPage() {
  return (
    <AdminOnly>
      <AdminDashboard />
    </AdminOnly>
  )
}
```

### Pages to Update
- [ ] `/dashboard/admin`
- [ ] `/dashboard/instructor`
- [ ] `/dashboard/student`
- [ ] `/courses/create`
- [ ] `/settings`
- [ ] Any other protected pages

---

## Phase 5: Verification (30 minutes)

### Functional Testing
- [ ] Test role selection on onboarding
- [ ] Test redirect to correct dashboard
- [ ] Test accessing admin routes as student (should deny)
- [ ] Test accessing student routes as admin (should allow)
- [ ] Test permission checks
- [ ] Test role updates

### Performance Testing
- [ ] Check cache statistics: `getCacheStats()`
- [ ] Verify cached sessions are < 1ms
- [ ] Verify DB lookups are 10-50ms
- [ ] Monitor memory usage
- [ ] Check for memory leaks

### Error Testing
- [ ] Test without authentication
- [ ] Test with invalid role
- [ ] Test with missing permissions
- [ ] Check error messages
- [ ] Verify redirects work

### Browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test on mobile
- [ ] Check console for errors

---

## Phase 6: Cleanup (30 minutes)

### Remove Old Files
- [ ] Delete `src/lib/auth/core.ts` (if not used elsewhere)
- [ ] Delete `src/lib/auth/guards.ts` (if not used elsewhere)
- [ ] Delete `src/lib/auth/permissions.ts` (if not used elsewhere)
- [ ] Delete `src/hooks/useAuth.ts` (if not used elsewhere)
- [ ] Delete `src/components/auth/RoleGuard.tsx` (if not used elsewhere)

### Update Imports
- [ ] Search for old imports in codebase
- [ ] Replace with new imports
- [ ] Remove unused imports
- [ ] Fix any remaining type errors

### Code Review
- [ ] Review all changes
- [ ] Check for console errors
- [ ] Verify all tests pass
- [ ] Check TypeScript compilation

---

## Phase 7: Documentation (30 minutes)

- [ ] Update project README with new auth system
- [ ] Document any custom modifications
- [ ] Add examples for common use cases
- [ ] Update team documentation
- [ ] Share `AUTH_QUICK_START.md` with team

---

## Phase 8: Deployment (1 hour)

### Pre-Deployment
- [ ] Run full test suite
- [ ] Check for console errors
- [ ] Verify all routes work
- [ ] Check performance metrics
- [ ] Review security settings

### Deployment
- [ ] Deploy to staging environment
- [ ] Run smoke tests
- [ ] Monitor for errors
- [ ] Check performance
- [ ] Verify cache working

### Post-Deployment
- [ ] Monitor production logs
- [ ] Check error rates
- [ ] Verify cache statistics
- [ ] Monitor performance
- [ ] Gather user feedback

---

## 📊 Progress Tracking

### Estimated Time
- Phase 1: 30 minutes ⏱️
- Phase 2: 1-2 hours ⏱️
- Phase 3: 1-2 hours ⏱️
- Phase 4: 1 hour ⏱️
- Phase 5: 30 minutes ⏱️
- Phase 6: 30 minutes ⏱️
- Phase 7: 30 minutes ⏱️
- Phase 8: 1 hour ⏱️

**Total: 6-8 hours** (can be done in parallel)

### Completion Status
- [ ] Phase 1: Setup & Testing - **0%**
- [ ] Phase 2: API Routes - **0%**
- [ ] Phase 3: Client Components - **0%**
- [ ] Phase 4: Protected Routes - **0%**
- [ ] Phase 5: Verification - **0%**
- [ ] Phase 6: Cleanup - **0%**
- [ ] Phase 7: Documentation - **0%**
- [ ] Phase 8: Deployment - **0%**

---

## 🆘 Troubleshooting During Migration

### Import Errors
```
Cannot find module '@/lib/auth/fast-guards'
```
- [ ] Verify file exists: `src/lib/auth/fast-guards.ts`
- [ ] Check import path spelling
- [ ] Restart dev server

### Type Errors
```
'SessionUser' is not assignable to type 'AuthenticatedUser'
```
- [ ] Use new `SessionUser` type instead of `AuthenticatedUser`
- [ ] Update type imports
- [ ] Check function return types

### Runtime Errors
```
Cannot read property 'id' of undefined
```
- [ ] Add type guard: `if (isErrorResponse(user)) return user`
- [ ] Check user is not null before accessing properties
- [ ] Add loading state handling

### Cache Issues
```
Session not updating after role change
```
- [ ] Manually invalidate: `invalidateSessionCache(userId)`
- [ ] Check cache TTL (5 minutes)
- [ ] Verify webhook is working
- [ ] Check database for role update

---

## ✅ Final Checklist

- [ ] All API routes updated
- [ ] All client components updated
- [ ] All protected routes updated
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] All tests passing
- [ ] Performance verified
- [ ] Documentation updated
- [ ] Team trained
- [ ] Deployed to production

---

## 📞 Support

If you encounter issues:

1. Check `AUTH_QUICK_START.md` for examples
2. Check `AUTH_SYSTEM.md` for full reference
3. Review error messages carefully
4. Check cache statistics: `getCacheStats()`
5. Enable debug logging in development
6. Check database directly for data integrity

---

## 🎉 Success Criteria

✅ All routes protected correctly
✅ Role selection works on onboarding
✅ Users redirected to correct dashboard
✅ Cache statistics show good performance
✅ No console errors
✅ All tests passing
✅ Team trained on new system
✅ Deployed to production

---

**Status**: Ready to migrate | Estimated time: 6-8 hours | Difficulty: Medium
