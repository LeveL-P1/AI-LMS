# 🎯 AI-LMS - Comprehensive Action Plan

**Created**: November 16, 2025  
**Status**: Ready for Implementation  
**Estimated Time**: 15-20 hours total

---

## 📋 Quick Reference

| Phase | Duration | Priority | Status |
|-------|----------|----------|--------|
| Phase 1: Critical Fixes | 2-3 hrs | 🔴 CRITICAL | Pending |
| Phase 2: API & Database | 4-5 hrs | 🟠 HIGH | Pending |
| Phase 3: Features | 6-8 hrs | 🟡 MEDIUM | Pending |
| Phase 4: Polish | 2-3 hrs | 🟢 LOW | Pending |

---

## 🔴 PHASE 1: CRITICAL FIXES (2-3 hours)

### Task 1.1: Fix Dynamic Route Parameters
**File**: `src/app/courses/[courseId]/page.tsx`  
**Status**: ❌ Broken  
**Time**: 15 mins

**Current Issue**:
```typescript
export default async function CourseDetailPage(props: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await props.params  // ✅ This is correct
  // But line 12 uses it before await
  const course = await db.course.findUnique({
    where: { id: courseId },  // ✅ This works
```

**Actually the issue is**: The error log shows `params.courseId` being used directly. Need to verify current state.

**Fix**:
```typescript
// Ensure all params are awaited before use
const { courseId } = await props.params;
// Then use courseId safely
```

**Files to Fix**:
- [ ] `src/app/courses/[courseId]/page.tsx`
- [ ] `src/app/courses/[courseId]/quiz/[quizId]/page.tsx`
- [ ] Any other dynamic routes

---

### Task 1.2: Fix useUser Hook
**File**: `src/hooks/use-user.ts`  
**Status**: ❌ Broken  
**Time**: 10 mins

**Current Code**:
```typescript
return {
  id: user?.id,
  email: user?.emailAddresses[0]?.emailAddress,
  name: user?.fullName,  // ← Returns 'name'
  role: user?.publicMetadata?.role,
  imageUrl: user?.imageUrl,
};
```

**Problem**: Component expects `fullName` but hook returns `name`

**Fix**:
```typescript
return {
  id: user?.id,
  email: user?.emailAddresses[0]?.emailAddress,
  fullName: user?.fullName,  // ← Change to 'fullName'
  name: user?.fullName,      // ← Keep for backward compatibility
  role: user?.publicMetadata?.role,
  imageUrl: user?.imageUrl,
  isLoaded,
  isSignedIn,
};
```

**Files to Update**:
- [ ] `src/hooks/use-user.ts` (fix return object)
- [ ] Any components using `useUser()` (verify they use correct property)

---

### Task 1.3: Standardize UserRole Enum
**File**: `src/types/index.ts` and `prisma/schema.prisma`  
**Status**: ❌ Broken  
**Time**: 20 mins

**Current Inconsistency**:
```typescript
// TypeScript (lowercase)
export enum UserRole {
  STUDENT = "student",
  INSTRUCTOR = "instructor",
  ADMIN = "admin"
}

// Prisma (uppercase)
enum UserRole {
  ADMIN
  INSTRUCTOR
  STUDENT
}
```

**Decision**: Use **UPPERCASE** everywhere (matches Prisma convention)

**Fix**:
1. Update TypeScript enum:
```typescript
export enum UserRole {
  STUDENT = "STUDENT",
  INSTRUCTOR = "INSTRUCTOR",
  ADMIN = "ADMIN"
}
```

2. Update webhook to NOT convert:
```typescript
// In src/app/api/webhooks/clerk/route.ts
const role = (data.public_metadata?.role || 'STUDENT').toUpperCase();
```

3. Update useUser hook:
```typescript
const normalizedRole = (roleString.toUpperCase() as UserRole) || UserRole.STUDENT;
```

**Files to Update**:
- [ ] `src/types/index.ts` (enum values)
- [ ] `src/hooks/use-user.ts` (normalization)
- [ ] `src/app/api/webhooks/clerk/route.ts` (role handling)
- [ ] `src/lib/auth/sync-user.ts` (if exists)
- [ ] Any files comparing roles

---

### Task 1.4: Add Missing Database Tables
**File**: `prisma/schema.prisma`  
**Status**: ❌ Incomplete  
**Time**: 30 mins

**Missing Tables**:

1. **Chapter** (Course Content)
```prisma
model Chapter {
  id          String   @id @default(cuid())
  courseId    String
  title       String
  description String?
  content     String?
  videoUrl    String?
  position    Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  @@index([courseId])
}
```

2. **Quiz** (Assessments)
```prisma
model Quiz {
  id            String   @id @default(cuid())
  courseId      String
  title         String
  description   String?
  passingScore  Float    @default(70)
  isPublished   Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  course        Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  questions     QuizQuestion[]
  attempts      QuizAttempt[]
  
  @@index([courseId])
  @@index([isPublished])
}
```

3. **QuizQuestion** (Quiz Questions)
```prisma
model QuizQuestion {
  id              String   @id @default(cuid())
  quizId          String
  question        String
  options         String[] // JSON array
  correctAnswer   String
  explanation     String?
  position        Int      @default(0)
  createdAt       DateTime @default(now())
  
  quiz            Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  
  @@index([quizId])
}
```

4. **QuizAttempt** (Student Quiz Attempts)
```prisma
model QuizAttempt {
  id        String   @id @default(cuid())
  userId    String
  quizId    String
  score     Float
  answers   Json
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  quiz      Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([quizId])
}
```

5. **Assignment** (Assignments)
```prisma
model Assignment {
  id          String   @id @default(cuid())
  courseId    String
  title       String
  description String?
  dueDate     DateTime?
  maxScore    Float    @default(100)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  submissions AssignmentSubmission[]
  
  @@index([courseId])
}
```

6. **AssignmentSubmission** (Student Submissions)
```prisma
model AssignmentSubmission {
  id           String   @id @default(cuid())
  assignmentId String
  userId       String
  fileUrl      String
  score        Float?
  feedback     String?
  submittedAt  DateTime @default(now())
  gradedAt     DateTime?
  
  assignment   Assignment @relation(fields: [assignmentId], references: [id], onDelete: Cascade)
  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([assignmentId, userId])
  @@index([userId])
  @@index([assignmentId])
}
```

**Update Course Model**:
```prisma
model Course {
  id           String       @id @default(cuid())
  title        String
  description  String?
  thumbnail    String?
  instructorId String?
  isPublished  Boolean      @default(false)  // ← ADD THIS
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  
  instructor   User?        @relation(fields: [instructorId], references: [id])
  chapters     Chapter[]
  quizzes      Quiz[]
  assignments  Assignment[]
  enrollments  Enrollment[]
  chatRooms    ChatRoom[]
  
  @@index([instructorId])
  @@index([title])
  @@index([isPublished])
}
```

**Update User Model**:
```prisma
model User {
  id          String   @id @default(cuid())
  clerkId     String   @unique
  email       String   @unique
  name        String?
  firstName   String?  // ← ADD THIS
  lastName    String?  // ← ADD THIS
  imageUrl    String?  // ← ADD THIS
  role        UserRole @default(STUDENT)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  courses              Course[]
  enrollments          Enrollment[]
  chatMessages         ChatMessage[]
  userActions          UserAction[]
  quizAttempts         QuizAttempt[]
  assignmentSubmissions AssignmentSubmission[]
  
  @@index([role])
  @@index([clerkId])
}
```

**Files to Update**:
- [ ] `prisma/schema.prisma` (add all tables above)
- [ ] Run `npm run db:migrate` after changes

---

### Task 1.5: Create Middleware
**File**: `src/middleware.ts` (CREATE NEW)  
**Status**: ❌ Missing  
**Time**: 20 mins

**Create File**: `src/middleware.ts`

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/courses',
  '/courses/(.*)',
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isInstructorRoute = createRouteMatcher(['/instructor(.*)', '/dashboard/instructor(.*)'])
const isStudentRoute = createRouteMatcher(['/student(.*)', '/dashboard/student(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()
  
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Protect all other routes - require authentication
  if (!userId) {
    return auth().redirectToSignIn()
  }

  // Get user role from Clerk metadata
  const role = (sessionClaims?.metadata as any)?.role || 'student'

  // Check admin routes
  if (isAdminRoute(req)) {
    if (role.toLowerCase() !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  // Check instructor routes
  if (isInstructorRoute(req)) {
    const userRole = role.toLowerCase()
    if (userRole !== 'instructor' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest))(?:.*)|api|trpc)(.*)',
  ],
}
```

**Files to Create**:
- [ ] `src/middleware.ts` (new file)

---

## 🟠 PHASE 2: API & DATABASE (4-5 hours)

### Task 2.1: Add Zod Validation Schemas
**File**: `src/lib/validation/` (CREATE NEW)  
**Time**: 45 mins

Create validation schemas for all API endpoints.

**Files to Create**:
- [ ] `src/lib/validation/course.ts`
- [ ] `src/lib/validation/enrollment.ts`
- [ ] `src/lib/validation/quiz.ts`
- [ ] `src/lib/validation/assignment.ts`

---

### Task 2.2: Add Error Handling to API Routes
**Files**: All API routes in `src/app/api/`  
**Time**: 60 mins

Add consistent error handling pattern to all endpoints.

---

### Task 2.3: Add Authentication Checks
**Files**: Protected API routes  
**Time**: 45 mins

Verify user is authenticated and has proper role.

---

### Task 2.4: Implement Pagination
**Files**: List endpoints (`/api/courses`, `/api/admin/users`, etc.)  
**Time**: 30 mins

Add limit/offset pagination to prevent large data transfers.

---

## 🟡 PHASE 3: FEATURES (6-8 hours)

### Task 3.1: Implement Course Management
- [ ] Create course endpoint
- [ ] Edit course endpoint
- [ ] Delete course endpoint
- [ ] Publish/unpublish course
- [ ] Upload course thumbnail

### Task 3.2: Implement Quiz Functionality
- [ ] Create quiz endpoint
- [ ] Add quiz questions endpoint
- [ ] Submit quiz answers endpoint
- [ ] Calculate quiz score
- [ ] Get quiz results

### Task 3.3: Implement Assignment Management
- [ ] Create assignment endpoint
- [ ] Upload assignment files
- [ ] Submit assignment endpoint
- [ ] Grade assignment endpoint
- [ ] Get submissions

### Task 3.4: Implement Progress Tracking
- [ ] Track course completion
- [ ] Track quiz attempts
- [ ] Calculate overall progress
- [ ] Get progress analytics

### Task 3.5: Implement AI Features
- [ ] Course recommendation endpoint
- [ ] Quiz auto-generation from lesson
- [ ] Performance summary endpoint

---

## 🟢 PHASE 4: POLISH (2-3 hours)

### Task 4.1: Add Error Boundaries
- [ ] Create error.tsx files
- [ ] Add error handling components

### Task 4.2: Add Loading States
- [ ] Loading skeletons
- [ ] Suspense boundaries

### Task 4.3: Add Input Validation
- [ ] Client-side form validation
- [ ] Real-time error messages

### Task 4.4: Add Tests
- [ ] Unit tests for hooks
- [ ] API route tests
- [ ] Component tests

### Task 4.5: Documentation
- [ ] API documentation
- [ ] Setup guide
- [ ] Deployment guide

---

## 📊 Progress Tracking

### Phase 1 Checklist
- [ ] Task 1.1: Fix dynamic route params
- [ ] Task 1.2: Fix useUser hook
- [ ] Task 1.3: Standardize UserRole enum
- [ ] Task 1.4: Add missing database tables
- [ ] Task 1.5: Create middleware
- [ ] Run database migrations
- [ ] Test all critical paths

### Phase 2 Checklist
- [ ] Task 2.1: Add validation schemas
- [ ] Task 2.2: Add error handling
- [ ] Task 2.3: Add auth checks
- [ ] Task 2.4: Add pagination
- [ ] Test all API endpoints

### Phase 3 Checklist
- [ ] Task 3.1: Course management
- [ ] Task 3.2: Quiz functionality
- [ ] Task 3.3: Assignment management
- [ ] Task 3.4: Progress tracking
- [ ] Task 3.5: AI features

### Phase 4 Checklist
- [ ] Task 4.1: Error boundaries
- [ ] Task 4.2: Loading states
- [ ] Task 4.3: Input validation
- [ ] Task 4.4: Tests
- [ ] Task 4.5: Documentation

---

## 🚀 Testing Strategy

### Phase 1 Testing
1. Start dev server: `npm run dev`
2. Test course detail page loads
3. Test student dashboard loads
4. Test admin dashboard loads
5. Test role-based routing

### Phase 2 Testing
1. Test all API endpoints with Postman/curl
2. Test error handling
3. Test pagination
4. Test auth checks

### Phase 3 Testing
1. Test course creation flow
2. Test quiz functionality
3. Test assignment submission
4. Test progress tracking

### Phase 4 Testing
1. Test error boundaries
2. Test loading states
3. Test form validation
4. Run unit tests

---

## 📝 Notes

- Keep commits small and focused
- Test after each phase
- Update documentation as you go
- Don't skip Phase 1 - it's critical
- Consider using feature branches

---

**Next Step**: Start with Phase 1, Task 1.1

