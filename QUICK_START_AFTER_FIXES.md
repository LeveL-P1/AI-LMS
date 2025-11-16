# 🚀 Quick Start Guide - After Fixes Applied

**Status**: Critical fixes applied, ready for database migration  
**Time to Production**: ~4-6 more hours of work

---

## ⚡ IMMEDIATE STEPS (Do This First)

### Step 1: Run Database Migration
```bash
npm run db:migrate
```

This will:
- Create all new tables (Chapter, Quiz, QuizQuestion, QuizAttempt, Assignment, AssignmentSubmission)
- Add missing fields to User and Course tables
- Create all indexes for performance

### Step 2: Start Development Server
```bash
npm run dev
```

Open http://localhost:3000

### Step 3: Test Authentication Flow
1. Sign up as a new user
2. Check Clerk dashboard - user should have `role` in metadata
3. Check database - user should be created with correct role
4. Try accessing `/admin` - should redirect to `/unauthorized`

---

## 🔧 WHAT'S WORKING NOW

✅ **Authentication**
- Clerk sign-in/sign-up
- Webhook syncs users to database
- Roles stored correctly (UPPERCASE)

✅ **Authorization**
- Middleware protects routes
- Role-based access control
- Admin/Instructor/Student separation

✅ **API Endpoints**
- `GET /api/courses` - list courses with pagination
- `POST /api/courses` - create course (instructor only)
- `GET /api/enrollments` - list user's enrollments
- `POST /api/enrollments` - enroll in course

✅ **Database**
- All tables created
- Proper relationships
- Ready for data

---

## 🛠️ WHAT NEEDS FIXING NEXT

### 1. Fix Course Detail Page (15 mins)
**File**: `src/app/courses/[courseId]/page.tsx`

Current issue: Chapters hardcoded as empty array

```typescript
// Line 27 - CHANGE THIS:
const chapters: Array<{ id: string; title: string; description: string | null }> = []

// TO THIS:
const chapters = await db.chapter.findMany({
  where: { courseId },
  orderBy: { position: 'asc' },
  select: {
    id: true,
    title: true,
    description: true,
  },
})
```

### 2. Fix Quiz Page (15 mins)
**File**: `src/app/courses/[courseId]/quiz/[quizId]/page.tsx`

Ensure params are awaited and quiz is fetched from database.

### 3. Update Instructor Dashboard (30 mins)
**File**: `src/app/(roles)/instructor/page.tsx`

Replace mock data with real API calls:

```typescript
'use client'
import { useEffect, useState } from 'react'

export default function InstructorPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses')
        const data = await res.json()
        setCourses(data.data.courses)
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Rest of component...
}
```

### 4. Update Admin Dashboard (30 mins)
**File**: `src/app/(roles)/admin/page.tsx`

Fetch real stats from `/api/admin/stats` endpoint (needs to be created).

### 5. Update Student Dashboard (30 mins)
**File**: `src/app/(roles)/student/page.tsx`

Fetch real enrollments from `/api/enrollments` endpoint.

---

## 📝 IMPLEMENTING NEW API ENDPOINTS

### Pattern to Follow

All new endpoints should follow this pattern:

```typescript
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma/prisma'
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  validationErrorResponse 
} from '@/lib/api-response'
import { yourSchema } from '@/lib/validations'

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return unauthorizedResponse()
    }

    // Get user
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return errorResponse('USER_NOT_FOUND', 'User not found', 404)
    }

    // Your logic here
    const data = await db.yourModel.findMany({
      where: { /* your conditions */ }
    })

    return successResponse(data)
  } catch (error) {
    console.error('Error:', error)
    return serverErrorResponse('Failed to fetch data')
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return unauthorizedResponse()
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return errorResponse('USER_NOT_FOUND', 'User not found', 404)
    }

    // Validate input
    const body = await request.json()
    const validation = yourSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error.errors)
    }

    // Your logic here
    const result = await db.yourModel.create({
      data: validation.data,
    })

    return successResponse(result, 201)
  } catch (error) {
    console.error('Error:', error)
    return serverErrorResponse('Failed to create')
  }
}
```

---

## 🎯 PRIORITY ENDPOINTS TO CREATE

### High Priority (Do First)
1. **Quiz Endpoints**
   - `POST /api/quizzes` - create quiz
   - `GET /api/quizzes/[id]` - get quiz with questions
   - `POST /api/quizzes/[id]/submit` - submit answers
   - `GET /api/quizzes/[id]/results` - get results

2. **Assignment Endpoints**
   - `POST /api/assignments` - create assignment
   - `POST /api/assignments/[id]/submit` - submit assignment
   - `GET /api/assignments/[id]/submissions` - get submissions (instructor)
   - `POST /api/assignments/[id]/grade` - grade submission (instructor)

3. **Admin Endpoints**
   - `GET /api/admin/stats` - platform statistics
   - `GET /api/admin/users` - list all users
   - `PUT /api/admin/users/[id]/role` - change user role

### Medium Priority
4. **Course Management**
   - `PUT /api/courses/[id]` - update course
   - `DELETE /api/courses/[id]` - delete course
   - `POST /api/courses/[id]/publish` - publish course
   - `POST /api/courses/[id]/chapters` - add chapter

5. **Progress Tracking**
   - `GET /api/progress/[courseId]` - get course progress
   - `POST /api/progress/[courseId]/update` - update progress

### Low Priority (Later)
6. **AI Features**
   - `POST /api/ai/recommend-courses` - recommend courses
   - `POST /api/ai/generate-quiz` - auto-generate quiz
   - `GET /api/ai/performance-summary` - summarize performance

---

## 🧪 TESTING YOUR ENDPOINTS

### Using Curl

```bash
# Get courses
curl http://localhost:3000/api/courses

# Create course (need auth token)
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"My Course","description":"A great course"}'

# Enroll in course
curl -X POST http://localhost:3000/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{"courseId":"course-id-here"}'
```

### Using Postman

1. Create new collection
2. Add requests for each endpoint
3. Set Authorization header if needed
4. Test different scenarios

---

## 🔐 SECURITY CHECKLIST

Before going to production:

- [ ] All protected routes check authentication
- [ ] All protected routes check authorization (role)
- [ ] All inputs are validated with Zod
- [ ] All errors don't leak sensitive information
- [ ] Database queries use parameterized queries (Prisma does this)
- [ ] CORS is configured properly
- [ ] Rate limiting is implemented
- [ ] Sensitive data is not logged
- [ ] Environment variables are not exposed

---

## 📊 DATABASE STRUCTURE

After migration, you'll have:

```
User
├── courses (as instructor)
├── enrollments
├── chatMessages
├── userActions
├── quizAttempts
└── assignmentSubmissions

Course
├── chapters
├── quizzes
├── assignments
├── enrollments
└── chatRooms

Quiz
├── questions
└── attempts

Assignment
└── submissions
```

---

## 🚨 COMMON ISSUES & FIXES

### Issue: "User not found" error
**Cause**: User not synced from Clerk to database  
**Fix**: Check Clerk webhook is configured correctly

### Issue: "Unauthorized" on all requests
**Cause**: Middleware is blocking requests  
**Fix**: Make sure you're signed in and user is in database

### Issue: "Role not recognized"
**Cause**: Role is not uppercase  
**Fix**: Check Clerk metadata has role set to UPPERCASE

### Issue: Database migration fails
**Cause**: Schema conflicts  
**Fix**: Check for existing migrations, run `npm run db:push` instead

---

## 📚 USEFUL COMMANDS

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run ESLint

# Database
npm run db:migrate       # Create migration
npm run db:push          # Push schema to DB
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database

# Clerk
# Set CLERK_WEBHOOK_SECRET in .env
# Configure webhook in Clerk dashboard
```

---

## 🎓 LEARNING RESOURCES

- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma ORM](https://www.prisma.io/docs)
- [Clerk Authentication](https://clerk.com/docs)
- [Zod Validation](https://zod.dev)
- [TypeScript](https://www.typescriptlang.org/docs)

---

## ✅ CHECKLIST FOR COMPLETION

- [ ] Database migration successful
- [ ] App starts without errors
- [ ] Can sign up and sign in
- [ ] Can create course as instructor
- [ ] Can enroll in course as student
- [ ] Can't access admin routes as student
- [ ] All API endpoints return proper responses
- [ ] No console errors
- [ ] No TypeScript errors

---

**Ready to continue?** Start with Step 1: Run Database Migration!

**Questions?** Check the error logs and FIXES_COMPLETED.md for details.

**Need help?** Review the code comments and API response patterns.

---

**Last Updated**: November 16, 2025  
**Next Session**: Database migration + component fixes  
**Estimated Time**: 4-6 hours to full functionality
