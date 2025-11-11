# ADMIN_ROLE_ARCHITECTURE.md

## Admin Role Overview

The admin role in AI-LMS is designed with **principle of least privilege**—admins have only the permissions necessary to manage platform health and security.

---

## 📋 Table of Contents

1. [Architecture Philosophy](#architecture-philosophy)
2. [Admin Permissions Matrix](#admin-permissions-matrix)
3. [Core Responsibilities](#core-responsibilities)
4. [Security Guidelines](#security-guidelines)
5. [Database Considerations](#database-considerations)

---

## Architecture Philosophy

### ✅ What Admins CAN Do

- **User Management**: Promote students to instructors, deactivate problematic users
- **Course Oversight**: Suspend or delete inappropriate courses
- **Platform Configuration**: Adjust settings (maintenance mode, email, enrollment limits)
- **Audit Logging**: View all user actions and admin activities
- **Analytics**: Platform-wide statistics and health monitoring

### ❌ What Admins CANNOT Do

- Edit student assignments or grades
- View student personal messages
- Modify course content (that's the instructor's role)
- Access financial/payment information (if applicable)
- Delete user accounts permanently (soft delete only)

---

## Admin Permissions Matrix

| Action | Admin | Instructor | Student |
|--------|-------|-----------|---------|
| View all users | ✅ | ❌ | ❌ |
| Promote user to instructor | ✅ | ❌ | ❌ |
| Deactivate user | ✅ | ❌ | ❌ |
| View all courses | ✅ | Only their own | Enrolled only |
| Suspend course | ✅ | ❌ | ❌ |
| Delete course | ✅ | ❌ | ❌ |
| Modify platform settings | ✅ | ❌ | ❌ |
| Access maintenance mode | ✅ | ❌ | ❌ |
| View audit log | ✅ | ❌ | ❌ |
| View platform analytics | ✅ | Their own analytics | ❌ |

---

## Core Responsibilities

### 1. User Management
- **Promote quality instructors**: Identify active students and promote them to INSTRUCTOR role
- **Handle abuse**: Deactivate users violating platform policies
- **Maintain data integrity**: Ensure no duplicate or spam accounts

### 2. Course Governance
- **Quality control**: Suspend courses with inappropriate content
- **Performance monitoring**: Check enrollment trends and course health
- **Cleanup**: Delete test, duplicate, or abandoned courses
- **Prevent abuse**: Stop spam course creation

### 3. Platform Health
- **Uptime management**: Activate maintenance mode during updates
- **Configuration tuning**: Adjust enrollment limits based on server capacity
- **Security**: Enforce MFA, session timeouts, password policies
- **Monitoring**: Track platform statistics and user actions

### 4. Audit & Compliance
- **Action logging**: Every admin action is logged with timestamp and changes
- **Accountability**: Track who did what and when
- **Compliance**: Maintain records for audits and investigations

---

## Security Guidelines

### ✅ Best Practices for Admins

```typescript
// Every admin endpoint MUST verify role
const { userId } = auth()
const user = await db.user.findUnique({ where: { id: userId } })

if (user?.role !== 'ADMIN') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

### 🔒 Implemented Security Measures

1. **Role Verification**: Every admin API route checks for ADMIN role
2. **Audit Logging**: All admin actions logged in `UserAction` table
3. **Confirmation Dialogs**: Destructive actions require user confirmation
4. **Soft Deletes**: Users are deactivated, not permanently deleted
5. **Error Handling**: Prevent cascade deletions of critical data
6. **Rate Limiting**: Consider adding rate limiting to prevent bulk operations

### ⚠️ Production Recommendations

```typescript
// Add these to production
- Implement rate limiting on admin endpoints
- Add IP whitelisting for admin access
- Require MFA for all admin users (requireMFA setting)
- Implement session expiry (sessionTimeout setting)
- Add webhook notifications for critical actions
- Implement audit trail retention policy (90 days minimum)
```

---

## Database Considerations

### Current Schema Usage

```prisma
// Admin uses these models
- User (id, email, role, createdAt)
- Course (id, title, instructorId, createdAt)
- Enrollment (userId, courseId)
- UserAction (userId, actionType, metadata) ← Admin actions logged here
```

### Recommended Schema Extensions

**For full feature implementation, add these fields:**

```prisma
model User {
  // ... existing fields
  isActive Boolean @default(true)  // For soft delete
  lastLoginAt DateTime?
  suspendedAt DateTime?
  suspendReason String?
}

model Course {
  // ... existing fields
  status String @default("ACTIVE")  // "ACTIVE" | "SUSPENDED" | "ARCHIVED"
  suspendedAt DateTime?
  suspendReason String?
}

model AuditLog {
  id String @id @default(cuid())
  adminId String
  admin User @relation(fields: [adminId], references: [id])
  action String  // "PROMOTE_USER", "SUSPEND_COURSE", etc.
  targetType String  // "USER" | "COURSE" | "SETTINGS"
  targetId String
  changes Json
  ipAddress String?
  createdAt DateTime @default(now())
}

enum PlatformSettings {
  PLATFORM_NAME
  SUPPORT_EMAIL
  MAINTENANCE_MODE
  SESSION_TIMEOUT
  // ... etc
}
```

---

## Admin Pages Overview

### 1. Admin Dashboard (`/admin`)
- **Purpose**: Platform overview with KPIs
- **Features**:
  - Total users (breakdown: admin, instructor, student)
  - Total courses and enrollments
  - Recent platform actions
  - Quick action buttons to other admin sections
- **Key Metric**: Average enrollment per course = Total Enrollments / Total Courses

### 2. User Management (`/admin/users`)
- **Purpose**: Manage user roles and status
- **Features**:
  - Search users by email or name
  - Filter by role (ADMIN, INSTRUCTOR, STUDENT)
  - Promote students to instructors
  - Deactivate users (soft delete)
  - View user statistics
- **Permissions**:
  - Cannot promote admins
  - Cannot deactivate admins
  - All actions logged

### 3. Course Management (`/admin/courses`)
- **Purpose**: Oversee all courses
- **Features**:
  - View all courses with instructor and enrollment data
  - Search and filter courses
  - Suspend courses (prevent enrollment, keep data)
  - Resume suspended courses
  - Delete courses (hard delete with confirmation)
- **Safety**:
  - Confirmation required for suspension/deletion
  - Deleted course count shown in audit log
  - Cannot delete courses with active enrollments warning

### 4. Platform Settings (`/admin/settings`)
- **Purpose**: Configure platform behavior
- **Tabs**:
  - **General**: Platform name, support email, enrollment limits
  - **Security**: MFA requirement, session timeout, password policy
  - **Maintenance**: Enable maintenance mode, custom message
- **Storage**: Currently in-memory (upgrade to database in production)

---

## API Endpoints

### Stats & Monitoring
- `GET /api/admin/stats` - Platform statistics

### User Management
- `GET /api/admin/users` - List all users
- `POST /api/admin/users/promote` - Promote to instructor
- `POST /api/admin/users/deactivate` - Deactivate user

### Course Management
- `GET /api/admin/courses` - List all courses
- `POST /api/admin/courses/suspend` - Suspend course
- `POST /api/admin/courses/resume` - Resume course
- `POST /api/admin/courses/delete` - Delete course

### Settings
- `GET /api/admin/settings` - Fetch platform settings
- `POST /api/admin/settings` - Update settings

---

## Audit Logging

### Logged Actions

Every admin action creates a `UserAction` record:

```typescript
{
  userId: "admin_id",
  actionType: "PROMOTE_TO_INSTRUCTOR" | "SUSPEND_COURSE" | "UPDATE_SETTINGS" | ...,
  metadata: {
    targetUserId: "user_id",
    targetEmail: "user@example.com",
    // action-specific data
  },
  createdAt: timestamp
}
```

### Viewing Audit Log

Admins can view recent actions on the dashboard. For full audit trail:

```typescript
const auditLog = await db.userAction.findMany({
  where: { actionType: { contains: 'ADMIN_' } },
  include: { user: true },
  orderBy: { createdAt: 'desc' },
  take: 100
})
```

---

## Next Steps: Production Readiness

- [ ] Add `isActive`, `status` fields to User/Course models
- [ ] Create `AuditLog` model for detailed tracking
- [ ] Implement rate limiting on admin endpoints
- [ ] Add IP whitelisting for admin dashboard
- [ ] Integrate email notifications for critical actions
- [ ] Set up audit log retention policy
- [ ] Add role-based middleware to protect admin routes
- [ ] Implement two-factor authentication enforcement

---

## Troubleshooting

### Q: Can admins access student grades?
A: No. Admins cannot view individual student grades or assignments. Use analytics endpoints for aggregate data only.

### Q: What happens when a course is deleted?
A: All related enrollments and actions are deleted (cascade delete). This is logged in audit trail.

### Q: How do we audit admin actions?
A: Every admin action creates a `UserAction` record. Query with `actionType` filters.

### Q: Can an admin promote another admin?
A: No. Admin creation must be done in production settings or database directly for security.

---

## Related Documentation

- `ADMIN_BEST_PRACTICES.md` - Implementation guidelines
- `ADMIN_IMPLEMENTATION_CHECKLIST.md` - Step-by-step setup
- `ROLE_BASED_ACCESS_CONTROL.md` - RBAC overview
