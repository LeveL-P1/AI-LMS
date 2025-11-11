# SkillSyncAI - Code Structure & Implementation Guide

## 📁 Project Structure Overview

```
AI-LMS/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout with Clerk provider
│   │   ├── page.tsx                   # Landing page
│   │   ├── (auth)/                    # Auth pages (outside main nav)
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── (roles)/                   # Role-based pages
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx          # Admin dashboard
│   │   │   │   ├── courses/
│   │   │   │   ├── settings/
│   │   │   │   └── users/
│   │   │   ├── instructor/
│   │   │   │   ├── page.tsx          # Instructor dashboard
│   │   │   │   ├── courses/
│   │   │   │   ├── analytics/
│   │   │   │   └── students/
│   │   │   └── student/
│   │   │       ├── page.tsx          # Student dashboard
│   │   │       ├── courses/
│   │   │       ├── progress/
│   │   │       ├── assignments/
│   │   │       └── quizzes/
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── stats/route.ts
│   │   │   │   ├── users/
│   │   │   │   ├── courses/
│   │   │   │   └── settings/
│   │   │   ├── courses/
│   │   │   ├── enrollments/
│   │   │   ├── permissions/route.ts
│   │   │   ├── user/
│   │   │   └── webhooks/
│   │   ├── courses/
│   │   │   ├── page.tsx              # Course catalog
│   │   │   └── [courseId]/
│   │   │       ├── page.tsx          # Course detail
│   │   │       └── quiz/[quizId]/
│   │   │           └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            # Dashboard layout
│   │   │   └── page.tsx              # Dashboard router
│   │   ├── onboarding/
│   │   │   ├── page.tsx
│   │   │   └── actions.ts
│   │   ├── unauthorized/
│   │   │   └── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── common/
│   │   │   └── ui/
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── input.tsx
│   │   │       ├── badge.tsx
│   │   │       ├── separator.tsx
│   │   │       └── theme-toggle.tsx
│   │   └── layout/
│   │       ├── header.tsx            # Landing page header
│   │       ├── navbar.tsx            # Dashboard navbar
│   │       ├── sidebar.tsx           # Dashboard sidebar
│   │       ├── dashboard-layout.tsx
│   │       ├── footer.tsx
│   │       └── ChatRoom.tsx
│   │
│   ├── hooks/
│   │   ├── use-user.ts               # Clerk user + metadata
│   │   └── usePermission.ts          # Role permissions
│   │
│   ├── lib/
│   │   ├── errors.ts                 # Error classes & logger
│   │   ├── supabase.ts               # Supabase client
│   │   ├── logAction.ts              # Analytics logging
│   │   ├── auth/
│   │   │   ├── sync-user.ts          # Sync Clerk → DB
│   │   │   └── testAuth.ts
│   │   ├── prisma/
│   │   │   └── prisma.ts             # Prisma singleton
│   │   └── utils/
│   │       ├── constants.ts
│   │       └── utils.ts
│   │
│   ├── types/
│   │   └── index.ts                  # Shared types
│   │
│   └── middleware.ts                 # Auth & role middleware
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── seed.ts                       # Database seeding
│   └── migrations/
│
├── pages/
│   ├── api/
│   │   ├── analytics/
│   │   ├── chat/
│   │   └── permissions/
│   └── (old API routes structure)
│
├── .env.local.example                # Environment template
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.js                # Tailwind CSS config
├── postcss.config.mjs                # PostCSS config
├── eslint.config.mjs                 # ESLint config
├── package.json                      # Dependencies
└── PRODUCTION_CHECKLIST.md           # Deployment guide
```

---

## 🔐 Authentication & Authorization Flow

### 1. User Sign Up/Sign In (Clerk)
```
User → Clerk UI → Sign Up/In → Redirect to /onboarding or /dashboard
```

### 2. Middleware Protection
```typescript
// src/middleware.ts
- Check if route requires auth
- Protect /api/admin routes (401)
- Protect /admin pages (redirect to /unauthorized)
- Protect /dashboard based on role
- Route role mismatches
```

### 3. User Database Sync
```typescript
// src/lib/auth/sync-user.ts (called on webhook)
Clerk User → Create/Update DB User
Set fields: clerkId, email, firstName, lastName, imageUrl, role
```

### 4. Role-Based Access
```typescript
// src/hooks/use-user.ts
- Get Clerk user
- Extract role from publicMetadata
- Provide isStudent, isInstructor, isAdmin
```

### 5. Permissions Retrieval
```typescript
// src/app/api/permissions/route.ts
- Fetch user from DB by clerkId
- Get role
- Return permissions for role from RolePermission table
```

---

## 📊 Database Schema

### Core Tables

#### Users
```prisma
User {
  id: String @id
  clerkId: String @unique         // Clerk user ID
  email: String @unique
  firstName: String?
  lastName: String?
  imageUrl: String?
  role: UserRole (STUDENT | INSTRUCTOR | ADMIN)
  
  enrollments: Enrollment[]
  messagesSent: ChatMessage[]
  actions: UserAction[]
  instructorCourses: Course[]
  quizAttempts: QuizAttempt[]
}
```

#### Courses
```prisma
Course {
  id: String @id
  title: String
  description: String?
  instructorId: String?
  instructor: User?
  
  duration: Int?              // minutes
  level: String              // "beginner" | "intermediate" | "advanced"
  price: Float
  isPublished: Boolean
  enrollmentCount: Int
  rating: Float
  
  enrollments: Enrollment[]
  chapters: Chapter[]
  quizzes: Quiz[]
  chatRooms: ChatRoom[]
}
```

#### Chapters (Lessons)
```prisma
Chapter {
  id: String @id
  title: String
  description: String?
  position: Int
  courseId: String
  course: Course
}
```

#### Quizzes
```prisma
Quiz {
  id: String @id
  title: String
  courseId: String
  isPublished: Boolean
  passingScore: Float
  
  questions: QuizQuestion[]
  attempts: QuizAttempt[]
}
```

#### Permissions
```prisma
Permission enum:
- CREATE_COURSE
- EDIT_COURSE
- DELETE_COURSE
- VIEW_COURSE
- SUBMIT_ASSIGNMENT
- GRADE_ASSIGNMENT
- VIEW_ANALYTICS
- MANAGE_USERS

RolePermission {
  role: UserRole
  permission: Permission
}
```

---

## 🛣️ Route Protection

### Public Routes
```
/                              # Landing page
/sign-in, /sign-up            # Auth pages
/courses (public catalog)       # Browse courses without enrolling
/api/courses (public API)       # Course data
/api/webhooks                   # Clerk webhooks
```

### Protected Routes (Auth Required)
```
/dashboard                      # Redirects to role dashboard
/dashboard/student             # Student dashboard
/dashboard/instructor          # Instructor dashboard
/dashboard/admin               # Admin dashboard
```

### Admin-Only Routes
```
/admin/*                        # All admin pages
/api/admin/*                    # Admin APIs (401 if not admin)
```

### Role-Specific Routes
```
/instructor/courses            # Instructor course management
/student/courses               # Student enrolled courses
```

---

## 🚀 API Endpoints

### Authentication & Permissions
```
GET  /api/permissions          # Get user permissions
```

### Admin APIs
```
GET  /api/admin/stats          # Platform statistics
GET  /api/admin/users          # List users
POST /api/admin/users          # Manage users
```

### Course APIs
```
GET  /api/courses              # List courses
POST /api/courses              # Create course
GET  /api/courses/[id]         # Get course
PUT  /api/courses/[id]         # Update course
DELETE /api/courses/[id]       # Delete course
POST /api/courses/[id]/publish # Publish course
```

### Enrollment APIs
```
POST /api/enrollments          # Enroll in course
GET  /api/enrollments          # Get user enrollments
DELETE /api/enrollments/[id]   # Unenroll
```

### Webhooks
```
POST /api/webhooks/user-created
POST /api/webhooks/user-updated
POST /api/webhooks/user-deleted
```

---

## 🎨 UI Components

### Common UI Components (`src/components/common/ui/`)
- `button.tsx` - Shadcn button component
- `card.tsx` - Card container
- `input.tsx` - Form input
- `badge.tsx` - Badge/tag
- `separator.tsx` - Divider
- `theme-toggle.tsx` - Light/dark mode toggle

### Layout Components (`src/components/layout/`)
- `header.tsx` - Landing page header with nav
- `navbar.tsx` - Dashboard top navigation
- `sidebar.tsx` - Dashboard left sidebar (role-aware)
- `footer.tsx` - Landing page footer
- `ChatRoom.tsx` - Course discussion component

---

## 🔧 Key Utilities

### Error Handling (`src/lib/errors.ts`)
```typescript
// Error classes
AppError
ValidationError
NotFoundError
UnauthorizedError
ForbiddenError

// Logger
logger.info()
logger.warn()
logger.error()
logger.debug()

// Safe wrapper
safeApiCall()
```

### Constants (`src/lib/utils/constants.ts`)
```typescript
NAV_LINKS
USER_ROLES
FEATURES
PRICING_PLANS
```

### Utilities (`src/lib/utils/utils.ts`)
```typescript
cn()              // classname merge
formatPrice()     // currency formatting
truncateText()    // text truncation
```

---

## 🔄 Data Flow Diagrams

### User Registration Flow
```
1. User fills signup form (Clerk UI)
2. Clerk creates user account
3. Clerk fires user.created webhook
4. Webhook → syncUser() function
5. syncUser creates DB user record
6. User redirected to /onboarding
7. Set role in Clerk publicMetadata
8. Redirect to /dashboard
```

### Course Enrollment Flow
```
1. Student views course on /courses
2. Click "Enroll" button
3. Server action calls db.enrollment.upsert()
4. Enrollment created
5. Redirect to course detail
6. Display course content (lessons, quizzes)
```

### Quiz Submission Flow
```
1. Student takes quiz on /courses/[courseId]/quiz/[quizId]
2. Submit form via server action
3. Calculate score based on answers
4. Create QuizAttempt record
5. Record user action for analytics
6. Redirect to course detail
7. Show results or progress
```

---

## 🧪 Testing Guide

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Build Test
```bash
npm run build
```

### Type Check
```bash
npx tsc --noEmit
```

### Lint
```bash
npm run lint
```

---

## 📦 Deployment Guide

### Local Development
```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Seed database (optional)
npm run db:seed

# Start dev server
npm run dev
```

### Production Build
```bash
# Build
npm run build

# Start
npm start
```

### Environment Setup
1. Copy `.env.local.example` to `.env.local`
2. Fill in all required variables
3. Run migrations: `npm run db:push`
4. Deploy to hosting platform

---

## 🔗 Integration Points

### Clerk
- User authentication
- Public metadata (role storage)
- Webhooks for user events

### Supabase
- File storage (course materials, assignments)
- Real-time features (chat)

### OpenAI
- Auto-generate quizzes from content
- Personalized recommendations

### PostgreSQL (Prisma)
- All structured data
- User information
- Courses, enrollments, quizzes
- Analytics data

---

## ⚡ Performance Optimization

### Database
- Indexed fields: role, clerkId, courseId, userId
- Query optimization with selective includes

### Caching
- Use Next.js ISR for course catalog
- Client-side caching for permissions

### Images
- Optimized with next/image
- Remote patterns for Supabase and Clerk

### Code Splitting
- Automatic with Next.js app router
- Lazy load heavy components

---

## 🛡️ Security Checklist

- [ ] Validate all inputs
- [ ] Sanitize user data
- [ ] Use HTTPS everywhere
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Set security headers
- [ ] Rotate API keys regularly
- [ ] Audit access logs
- [ ] Monitor unusual activity
- [ ] Keep dependencies updated

---

## 📈 Monitoring & Observability

### Logging
- Production logger in `src/lib/errors.ts`
- All API errors logged

### Analytics
- User actions tracked in UserAction table
- Quiz attempts recorded for progress

### Metrics to Track
- User engagement
- Course completion rates
- Quiz performance
- API response times
- Error rates

---

## 🤝 Contributing Guidelines

1. Follow TypeScript strict mode
2. Use error handling utilities
3. Add proper JSDoc comments
4. Update PRODUCTION_CHECKLIST when adding routes
5. Test before pushing
6. Update documentation

---

## 📞 Support

For issues or questions:
1. Check PRODUCTION_CHECKLIST.md
2. Review error logs with logger utility
3. Check database schema in prisma/schema.prisma
4. Verify environment variables
5. Check middleware.ts for route protection

---

**Last Updated**: November 11, 2025
**Version**: 1.0.0 - Production Ready
