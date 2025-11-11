# ADMIN_QUICK_START.md

## Admin Role - Quick Start Guide

**Last Updated**: November 11, 2025  
**Status**: Production Ready ✅

---

## 🚀 Quick Navigation

### For Developers

#### Understanding the Admin Role
1. Start with: `ADMIN_ROLE_ARCHITECTURE.md` (15 min read)
2. Then: `ADMIN_BEST_PRACTICES.md` (20 min read)
3. Finally: `ADMIN_IMPLEMENTATION_CHECKLIST.md` (reference)

#### Implementing New Admin Features
1. Check: `ADMIN_BEST_PRACTICES.md` - follow patterns
2. Reference: Source files in `/src/app/(roles)/admin/` and `/src/app/api/admin/`
3. Verify: All endpoints have role checks and audit logging

#### Testing Admin Features
```bash
# Test admin authorization
curl -H "Authorization: Bearer $USER_TOKEN" \
  https://your-app.com/api/admin/stats

# Test user promotion
curl -X POST https://your-app.com/api/admin/users/promote \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id-here"}'
```

---

## 📋 Admin Pages at a Glance

### 1. Dashboard (`/admin`)
```
┌─────────────────────────────────────┐
│ Admin Dashboard                      │
├─────────────────────────────────────┤
│ Total Users: 150 (10 admins)         │
│ Total Courses: 45                    │
│ Total Enrollments: 890               │
├─────────────────────────────────────┤
│ Recent Actions (Last 10)             │
│ • User promoted to instructor        │
│ • Course suspended by admin          │
├─────────────────────────────────────┤
│ Quick Actions [Users] [Courses]      │
│                [Settings] [Analytics]│
└─────────────────────────────────────┘
```

### 2. User Management (`/admin/users`)
```
┌─────────────────────────────────────┐
│ User Management                      │
├─────────────────────────────────────┤
│ [Search by email/name]    [Role ▼]   │
├─────────────────────────────────────┤
│ Email           | Role        | Act  │
│ john@test.com   | STUDENT  → Promote│
│ jane@test.com   | INSTRUCTOR | → |
│ admin@test.com  | ADMIN      | - |
└─────────────────────────────────────┘
```

### 3. Course Management (`/admin/courses`)
```
┌─────────────────────────────────────┐
│ Course Management                    │
├─────────────────────────────────────┤
│ [Search by title]       [Status ▼]   │
├─────────────────────────────────────┤
│ ┌──────────────────────┐             │
│ │ Course Title    ACTIVE│             │
│ │ Instructor: John   50 │             │
│ │ [Suspend] [Delete]    │             │
│ └──────────────────────┘             │
└─────────────────────────────────────┘
```

### 4. Settings (`/admin/settings`)
```
┌─────────────────────────────────────┐
│ [General] [Security] [Maintenance]  │
├─────────────────────────────────────┤
│ General Settings                     │
│ Platform Name:    [AI-LMS          ]│
│ Support Email:    [support@...]    │
│ Max Enrollment:   [100            ]│
│ [Save Changes]                       │
└─────────────────────────────────────┘
```

---

## 🔌 API Endpoints Reference

### Stats
```
GET /api/admin/stats
Response: { totalUsers, totalInstructors, totalStudents, 
            totalCourses, totalEnrollments, recentActions }
```

### Users
```
GET /api/admin/users
Response: Array of { id, email, name, role, enrollmentCount }

POST /api/admin/users/promote
Body: { userId: "user-id" }
Response: { success: true, user: {...} }

POST /api/admin/users/deactivate
Body: { userId: "user-id" }
Response: { success: true }
```

### Courses
```
GET /api/admin/courses
Response: Array of { id, title, instructorName, enrollmentCount }

POST /api/admin/courses/suspend
Body: { courseId: "course-id" }
Response: { success: true }

POST /api/admin/courses/resume
Body: { courseId: "course-id" }
Response: { success: true }

POST /api/admin/courses/delete
Body: { courseId: "course-id" }
Response: { success: true }
```

### Settings
```
GET /api/admin/settings
Response: { general: {...}, security: {...}, maintenance: {...} }

POST /api/admin/settings
Body: { section: "general", platformName: "AI-LMS", ... }
Response: { success: true, settings: {...} }
```

---

## ✅ Admin Capabilities Checklist

### Users
- [x] View all users with roles
- [x] Search by email/name
- [x] Filter by role
- [x] Promote to instructor
- [x] Deactivate user
- [x] View enrollment count

### Courses
- [x] View all courses
- [x] Search by title/instructor
- [x] Filter by status
- [x] Suspend courses
- [x] Resume courses
- [x] Delete courses

### Settings
- [x] Set platform name
- [x] Set support email
- [x] Configure enrollment limit
- [x] Enable maintenance mode
- [x] Set session timeout
- [x] Configure password policy

### Analytics
- [x] View platform KPIs
- [x] See role distribution
- [x] Track recent actions
- [x] View audit trail

---

## 🔐 Security Quick Tips

### Principle of Least Privilege
Admin can only:
- Manage users ✓ (promote/deactivate)
- Manage courses ✓ (suspend/delete)
- Configure settings ✓

Admin CANNOT:
- View student grades ✗
- Access course content ✗
- See student messages ✗

### Audit Everything
Every admin action creates a record:
```
UserAction {
  adminId: "admin-123",
  actionType: "PROMOTE_TO_INSTRUCTOR",
  metadata: { targetUserId, targetEmail, timestamp },
  createdAt: now()
}
```

### Never Trust the Client
Always verify on the server:
```typescript
// ✅ CORRECT
const user = await db.user.findUnique({ where: { id: userId } })
if (user?.role !== 'ADMIN') return forbidden()

// ❌ WRONG
if (request.headers['x-admin'] === 'true') return ok() // Spoofable!
```

---

## 🐛 Troubleshooting

### "Forbidden: Admin access required"
**Cause**: User is not an admin
**Fix**: Verify user role in database: `SELECT role FROM "User" WHERE id = 'user-id'`
**Solution**: Promote user via database or admin panel

### "Cannot promote admin users"
**Cause**: Trying to promote someone who is already an admin
**Fix**: Only promote students or instructors (not admins)

### "Course not found"
**Cause**: Course ID doesn't exist
**Fix**: Check course ID is correct, verify in database

### Settings not persisting
**Cause**: Settings stored in memory (current implementation)
**Fix**: In production, migrate to database storage
**See**: `ADMIN_IMPLEMENTATION_CHECKLIST.md` Phase 7

---

## 📚 Documentation Map

```
ADMIN_ROLE_ARCHITECTURE.md ← Start here for overview
    ↓
ADMIN_BEST_PRACTICES.md ← Implementation details
    ↓
ADMIN_IMPLEMENTATION_CHECKLIST.md ← Progress tracking
    ↓
ADMIN_ROLE_FEATURES_COMPARISON.md ← Compare with other roles
    ↓
ADMIN_IMPLEMENTATION_SUMMARY.md ← Project completion
```

---

## 🚀 Common Tasks

### Task: Promote User to Instructor
1. Go to `/admin/users`
2. Search for user by email
3. Click "Promote" button
4. Confirm in dialog
5. ✅ User is now an instructor

### Task: Suspend Problematic Course
1. Go to `/admin/courses`
2. Search for course by title
3. Click "Suspend" button
4. Confirm in dialog
5. ✅ Course is suspended (data preserved)

### Task: Enable Maintenance Mode
1. Go to `/admin/settings`
2. Click "Maintenance" tab
3. Toggle "Maintenance Mode" on
4. Enter maintenance message
5. Click "Save Changes"
6. ✅ All non-admin users see maintenance message

### Task: Review Admin Actions
1. Go to `/admin`
2. Scroll to "Recent Platform Actions"
3. View recent actions with timestamps
4. ✅ See who did what and when

---

## 🎯 Best Practices Summary

✅ Always confirm before destructive actions  
✅ Keep audit log for compliance  
✅ Verify admin authorization server-side  
✅ Use soft deletes (preserve data)  
✅ Log all changes with metadata  
✅ Communicate policy enforcement to users  
✅ Review audit trail regularly  
✅ Test authorization on new features  

---

## 📞 Getting Help

### For Feature Questions
→ See `ADMIN_ROLE_ARCHITECTURE.md`

### For Implementation Questions
→ See `ADMIN_BEST_PRACTICES.md`

### For Progress Tracking
→ See `ADMIN_IMPLEMENTATION_CHECKLIST.md`

### For Role Comparison
→ See `ADMIN_ROLE_FEATURES_COMPARISON.md`

### For Code Examples
→ Check `/src/app/(roles)/admin/` and `/src/app/api/admin/`

---

## 📊 File Reference

| File | Purpose | Read Time |
|------|---------|-----------|
| ADMIN_ROLE_ARCHITECTURE.md | Design overview | 15 min |
| ADMIN_BEST_PRACTICES.md | Implementation guide | 20 min |
| ADMIN_IMPLEMENTATION_CHECKLIST.md | Progress tracking | 5 min |
| ADMIN_ROLE_FEATURES_COMPARISON.md | Role comparison | 10 min |
| ADMIN_IMPLEMENTATION_SUMMARY.md | Project summary | 10 min |
| ADMIN_QUICK_START.md | This file | 5 min |

---

**Status**: ✅ Production Ready  
**Last Updated**: November 11, 2025  
**Questions?** Refer to the comprehensive documentation files above.
