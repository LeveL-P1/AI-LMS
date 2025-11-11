# ADMIN_BEST_PRACTICES.md

## Admin Implementation Best Practices

This guide provides best practices for using and maintaining the admin role in AI-LMS.

---

## 📋 Table of Contents

1. [Frontend Best Practices](#frontend-best-practices)
2. [Backend Security](#backend-security)
3. [UI/UX Patterns](#uiux-patterns)
4. [Error Handling](#error-handling)
5. [Performance Optimization](#performance-optimization)
6. [Testing Guidelines](#testing-guidelines)

---

## Frontend Best Practices

### 1. Always Verify Admin Role on Load

```typescript
// ✅ GOOD - Verify in server component
export default async function AdminPage() {
  const { userId } = auth()
  const user = await db.user.findUnique({ where: { id: userId } })

  if (user?.role !== 'ADMIN') {
    redirect('/unauthorized')
  }

  return <AdminContent />
}

// ❌ AVOID - Client-side only verification
// Anyone can spoof admin access with dev tools
export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  // ...
}
```

### 2. Show Confirmation Dialogs for Destructive Actions

```typescript
// ✅ GOOD - Confirmation required
const handleDelete = async (id: string) => {
  if (!confirm('Delete course? This action cannot be undone.')) {
    return  // User canceled
  }
  // Proceed with deletion
}

// ❌ AVOID - No confirmation
const handleDelete = async (id: string) => {
  await fetch(`/api/admin/courses/delete`, {
    method: 'POST',
    body: JSON.stringify({ courseId: id })
  })
}
```

### 3. Disable Buttons During Loading

```typescript
// ✅ GOOD - User knows action is processing
<Button
  disabled={actionLoading === courseId}
  onClick={() => handleSuspend(courseId)}
>
  {actionLoading === courseId ? (
    <Loader2 className="w-4 h-4 animate-spin" />
  ) : (
    'Suspend'
  )}
</Button>

// ❌ AVOID - User can click multiple times
<Button onClick={() => handleSuspend(courseId)}>
  Suspend
</Button>
```

### 4. Display Status Badges with Color Coding

```typescript
// ✅ GOOD - Visual feedback
const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'bg-red-500/20 text-red-700'
    case 'INSTRUCTOR':
      return 'bg-blue-500/20 text-blue-700'
    case 'STUDENT':
      return 'bg-green-500/20 text-green-700'
  }
}

// Use consistent colors across all admin pages
```

### 5. Implement Search & Filtering

```typescript
// ✅ GOOD - Client-side filtering with state
const [filteredUsers, setFilteredUsers] = useState([])
const [searchTerm, setSearchTerm] = useState('')
const [filterRole, setFilterRole] = useState('ALL')

useEffect(() => {
  let filtered = users
  if (searchTerm) {
    filtered = filtered.filter(u =>
      u.email.includes(searchTerm.toLowerCase())
    )
  }
  if (filterRole !== 'ALL') {
    filtered = filtered.filter(u => u.role === filterRole)
  }
  setFilteredUsers(filtered)
}, [searchTerm, filterRole, users])
```

---

## Backend Security

### 1. Always Verify Admin Role (First Line of Defense)

```typescript
// ✅ REQUIRED on every admin endpoint
export async function POST(request: NextRequest) {
  const { userId } = auth()
  const admin = await db.user.findUnique({ where: { id: userId } })

  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Proceed with admin operation
}
```

### 2. Log All Admin Actions

```typescript
// ✅ GOOD - Comprehensive logging
await db.userAction.create({
  data: {
    userId: adminId,
    actionType: 'PROMOTE_TO_INSTRUCTOR',
    metadata: {
      targetUserId: userId,
      targetEmail: userEmail,
      timestamp: new Date(),
      ipAddress: request.headers.get('x-forwarded-for'), // If available
    }
  }
})

// Query audit trail later
const auditTrail = await db.userAction.findMany({
  where: { actionType: 'PROMOTE_TO_INSTRUCTOR' },
  orderBy: { createdAt: 'desc' }
})
```

### 3. Prevent Self-Harm Actions

```typescript
// ✅ GOOD - Prevent admins deactivating themselves
if (targetUserId === userId) {
  return NextResponse.json(
    { error: 'Cannot deactivate yourself' },
    { status: 400 }
  )
}

// ✅ GOOD - Prevent deleting last admin
const adminCount = await db.user.count({ where: { role: 'ADMIN' } })
if (adminCount === 1 && targetUser.role === 'ADMIN') {
  return NextResponse.json(
    { error: 'Cannot delete last admin' },
    { status: 400 }
  )
}
```

### 4. Validate Input Thoroughly

```typescript
// ✅ GOOD - Input validation
const { courseId, reason } = await request.json()

if (!courseId || typeof courseId !== 'string') {
  return NextResponse.json(
    { error: 'Invalid courseId' },
    { status: 400 }
  )
}

if (reason && reason.length > 500) {
  return NextResponse.json(
    { error: 'Reason must be under 500 characters' },
    { status: 400 }
  )
}

// Verify course exists
const course = await db.course.findUnique({
  where: { id: courseId }
})
if (!course) {
  return NextResponse.json(
    { error: 'Course not found' },
    { status: 404 }
  )
}
```

### 5. Use Soft Deletes, Not Hard Deletes

```typescript
// ✅ GOOD - Soft delete (mark as inactive)
await db.user.update({
  where: { id: userId },
  data: {
    isActive: false,
    deactivatedAt: new Date(),
    deactivationReason: reason
  }
})

// ❌ AVOID - Hard delete loses data permanently
await db.user.delete({ where: { id: userId } })
```

---

## UI/UX Patterns

### 1. Table with Pagination

```typescript
// ✅ GOOD - Paginated table prevents loading 10K rows
const [page, setPage] = useState(1)
const pageSize = 20

const users = await fetchUsers({
  skip: (page - 1) * pageSize,
  take: pageSize
})

const totalPages = Math.ceil(totalUsers / pageSize)
```

### 2. Confirmation Modal

```typescript
// ✅ GOOD - Modal asks for confirmation
<ConfirmDialog
  title="Delete Course?"
  description="This action cannot be undone. All enrollments will be removed."
  danger={true}
  onConfirm={() => handleDelete()}
  onCancel={() => setShowDialog(false)}
/>
```

### 3. Toast Notifications

```typescript
// ✅ GOOD - User gets immediate feedback
if (success) {
  showToast({
    type: 'success',
    message: 'User promoted to instructor',
    duration: 3000
  })
}
```

### 4. Empty States

```typescript
// ✅ GOOD - Helpful empty state
{filteredUsers.length === 0 ? (
  <div className="text-center py-8">
    <Users className="w-12 h-12 mx-auto opacity-50" />
    <p className="text-muted-foreground mt-2">No users found</p>
    <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
  </div>
) : (
  // Render users table
)}
```

---

## Error Handling

### 1. Specific Error Messages

```typescript
// ✅ GOOD - Specific, actionable error
if (user.role === 'ADMIN') {
  return {
    success: false,
    error: 'Cannot promote admin users. Admin status must be assigned manually.'
  }
}

// ❌ AVOID - Generic error
return { success: false, error: 'Error' }
```

### 2. Error Logging

```typescript
// ✅ GOOD - Log for debugging
try {
  // ... operation
} catch (error) {
  console.error('Admin action failed:', {
    action: 'PROMOTE_USER',
    userId: targetUserId,
    adminId: adminUserId,
    error: error instanceof Error ? error.message : String(error),
    timestamp: new Date()
  })

  return NextResponse.json(
    { error: 'Operation failed' },
    { status: 500 }
  )
}
```

### 3. User-Friendly Error Display

```typescript
// ✅ GOOD - Show error to user
{error && (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
    <AlertCircle className="w-5 h-5 text-red-500" />
    <p className="text-sm text-red-700">{error}</p>
    <button
      onClick={() => setError(null)}
      className="ml-auto text-xs font-medium text-red-600 hover:underline"
    >
      Dismiss
    </button>
  </div>
)}
```

---

## Performance Optimization

### 1. Use Database Indexes

```prisma
// ✅ GOOD - Indexes on frequently filtered fields
model User {
  // ...
  role UserRole

  @@index([role])  // Index for role filtering
  @@index([createdAt])  // Index for sorting
}

model Course {
  // ...
  instructorId String?

  @@index([instructorId])  // Index for instructor lookup
  @@index([title])  // Index for search
}
```

### 2. Limit Query Results

```typescript
// ✅ GOOD - Pagination prevents loading all data
const users = await db.user.findMany({
  take: 20,      // Limit to 20 per page
  skip: (page - 1) * 20,
  orderBy: { createdAt: 'desc' }
})

// ❌ AVOID - Loading 100K users into memory
const allUsers = await db.user.findMany()
```

### 3. Select Only Needed Fields

```typescript
// ✅ GOOD - Select specific fields
const users = await db.user.findMany({
  select: {
    id: true,
    email: true,
    name: true,
    role: true,
    _count: { select: { enrollments: true } }
  }
})

// ❌ AVOID - Load all fields you don't need
const users = await db.user.findMany()
```

### 4. Batch Operations

```typescript
// ✅ GOOD - Batch requests
const stats = await Promise.all([
  db.user.count(),
  db.course.count(),
  db.enrollment.count(),
  db.userAction.findMany({ take: 10 })
])

// ❌ AVOID - Sequential requests
const userCount = await db.user.count()
const courseCount = await db.course.count()
const enrollmentCount = await db.enrollment.count()
```

---

## Testing Guidelines

### 1. Test Admin Authorization

```typescript
// ✅ GOOD - Test non-admin gets rejected
const response = await fetch('/api/admin/users', {
  headers: { 'Authorization': `Bearer ${studentToken}` }
})
expect(response.status).toBe(403)
```

### 2. Test Destructive Actions

```typescript
// ✅ GOOD - Test with confirmation
test('delete course requires confirmation', async () => {
  const result = await deleteCoursePage.deleteCourse('course-id')
  expect(confirmDialog).toBeVisible()
  expect(courseStillExists).toBe(true)

  await confirmDialog.confirm()
  expect(courseExists).toBe(false)
})
```

### 3. Test Audit Logging

```typescript
// ✅ GOOD - Verify audit trail
test('admin action is logged', async () => {
  await promoteUser('user-id')

  const auditEntry = await db.userAction.findFirst({
    where: {
      userId: adminId,
      actionType: 'PROMOTE_TO_INSTRUCTOR'
    }
  })

  expect(auditEntry).toBeDefined()
  expect(auditEntry.metadata.targetUserId).toBe('user-id')
})
```

---

## Checklist: Admin Page Implementation

- [ ] Verify admin role on page load (server-side)
- [ ] Add confirmation dialogs for delete/suspend actions
- [ ] Disable buttons during loading
- [ ] Show role badges with consistent colors
- [ ] Implement search and filtering
- [ ] Log all admin actions in UserAction table
- [ ] Prevent self-harm actions (self-deactivation)
- [ ] Validate all input on backend
- [ ] Use soft deletes, not hard deletes
- [ ] Paginate large datasets
- [ ] Show empty states with helpful messages
- [ ] Display specific error messages
- [ ] Test authorization (non-admin rejection)
- [ ] Test audit logging
- [ ] Optimize queries with indexes

---

## Related Documentation

- `ADMIN_ROLE_ARCHITECTURE.md` - High-level design
- `ADMIN_IMPLEMENTATION_CHECKLIST.md` - Setup steps
- Security best practices in Next.js docs
