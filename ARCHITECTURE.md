# 🏗️ SkillSyncAI - Architecture & Technical Stack

**Last Updated**: November 11, 2025  
**Project**: AI-LMS  
**Version**: 0.1.0  
**Status**: Production Ready

---

## 📋 Table of Contents
1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Database Schema](#database-schema)
4. [Authentication & Authorization](#authentication--authorization)
5. [API Routes](#api-routes)
6. [Component Architecture](#component-architecture)
7. [State Management](#state-management)
8. [Security](#security)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 15.4.1 | React framework with App Router |
| **React** | 19.1.0 | UI library |
| **TypeScript** | 5.9.2 | Type safety |
| **Tailwind CSS** | 4.1.11 | Utility-first CSS |
| **Framer Motion** | 12.23.12 | Animations |
| **Lucide React** | 0.525.0 | Icon library |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 18+ LTS | Runtime |
| **Prisma** | 6.12.0 | ORM for database |
| **PostgreSQL** | 14+ | Relational database |

### Authentication & Services
| Service | Provider | Purpose |
|---------|----------|---------|
| **Clerk** | Clerk Inc. | User authentication & management |
| **Supabase** | Supabase | Database hosting & file storage |
| **OpenAI** | OpenAI | AI features (future) |
| **Svix** | Svix | Webhook management |

### Development Tools
| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | 9.39.1 | Code linting |
| **TypeScript** | 5.9.2 | Type checking |
| **Prisma** | 6.12.0 | Database migration & generation |

---

## 📁 Project Structure

```
AI-LMS/
├── src/
│   ├── app/                          # Next.js 15 App Router (main routes)
│   │   ├── (auth)/
│   │   │   ├── sign-in/              # Clerk sign-in page
│   │   │   └── sign-up/              # Clerk sign-up page
│   │   ├── (roles)/
│   │   │   ├── admin/                # Admin dashboard
│   │   │   │   ├── page.tsx
│   │   │   │   ├── users/            # User management
│   │   │   │   ├── courses/          # Course management
│   │   │   │   ├── settings/         # Platform settings
│   │   │   │   └── stats/            # Analytics
│   │   │   ├── instructor/           # Instructor dashboard
│   │   │   │   ├── page.tsx
│   │   │   │   ├── courses/          # Manage courses
│   │   │   │   ├── analytics/        # View student metrics
│   │   │   │   └── students/         # View enrolled students
│   │   │   └── student/              # Student dashboard
│   │   │       ├── page.tsx
│   │   │       ├── courses/          # Browse courses
│   │   │       ├── assignments/      # View assignments
│   │   │       ├── progress/         # Track progress
│   │   │       └── quizzes/          # Take quizzes
│   │   ├── api/                      # API routes
│   │   │   ├── admin/                # Admin endpoints
│   │   │   │   ├── courses/
│   │   │   │   ├── stats/
│   │   │   │   ├── users/
│   │   │   │   └── settings/
│   │   │   ├── courses/              # Course endpoints
│   │   │   ├── enrollments/          # Enrollment endpoints
│   │   │   ├── user/                 # User endpoints
│   │   │   ├── permissions/          # Permission endpoints
│   │   │   ├── analytics/            # Analytics endpoints
│   │   │   ├── chat/                 # Chat endpoints
│   │   │   └── webhooks/             # Clerk webhooks
│   │   ├── courses/                  # Public course browsing
│   │   │   ├── page.tsx              # Course catalog
│   │   │   └── [courseId]/           # Course details
│   │   │       ├── page.tsx
│   │   │       └── quiz/             # Quiz routes
│   │   │           └── [quizId]/
│   │   ├── dashboard/                # Dashboard routing
│   │   │   ├── page.tsx              # Main dashboard
│   │   │   ├── layout.tsx            # Dashboard layout
│   │   │   └── [role]/               # Role-specific dashboards
│   │   ├── onboarding/               # New user onboarding
│   │   ├── unauthorized/             # Error pages
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing page
│   │
│   ├── components/
│   │   ├── common/
│   │   │   └── ui/                   # Shadcn/UI components
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── input.tsx
│   │   │       ├── theme-toggle.tsx
│   │   │       └── ...               # Other UI components
│   │   ├── landing/                  # Landing page components
│   │   │   ├── hero.tsx
│   │   │   ├── features.tsx
│   │   │   └── pricing.tsx
│   │   └── layout/                   # Layout components
│   │       ├── header.tsx            # Top navigation
│   │       ├── navbar.tsx            # Authenticated navbar
│   │       ├── sidebar.tsx           # Sidebar with role-based nav
│   │       ├── footer.tsx
│   │       ├── dashboard-layout.tsx
│   │       └── ChatRoom.tsx          # Chat component
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-user.ts               # Get current user + role
│   │   └── usePermission.ts          # Get user permissions
│   │
│   ├── lib/                          # Utilities & configurations
│   │   ├── supabase.ts               # Supabase client setup
│   │   ├── logAction.ts              # Action logging
│   │   ├── errors.ts                 # Custom error classes
│   │   ├── auth/
│   │   │   ├── sync-user.ts          # Sync Clerk user with DB
│   │   │   └── testAuth.ts           # Auth testing utilities
│   │   ├── prisma/
│   │   │   └── prisma.ts             # Prisma client singleton
│   │   └── utils/
│   │       ├── constants.ts          # App constants
│   │       └── utils.ts              # Helper functions
│   │
│   ├── types/
│   │   └── index.ts                  # TypeScript type definitions
│   │
│   ├── middleware.ts                 # Next.js middleware (auth & routing)
│   
├── prisma/
│   ├── schema.prisma                 # Database schema (Prisma ORM)
│   ├── seed.ts                       # Database seeding script
│   └── migrations/
│       ├── 20251109150252_init_schema/
│       │   └── migration.sql
│       └── migration_lock.toml
│
├── pages/
│   └── api/                          # Legacy API routes (if any)
│       ├── permissions/
│       │   └── index.ts
│       ├── analytics/
│       ├── chat/
│       └── ...
│
├── public/                           # Static assets
│
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
├── eslint.config.mjs                 # ESLint configuration
│
└── Documentation/
    ├── SETUP_GUIDE.md                # Setup instructions
    ├── ARCHITECTURE.md               # This file
    ├── DEPLOYMENT.md                 # Deployment guide
    └── README.md                     # Project overview
```

---

## 🗄️ Database Schema

### Core Tables

#### **Users**
```sql
CREATE TABLE User (
  id              String @id @default(cuid())
  clerkId         String @unique              -- Clerk authentication ID
  email           String @unique              -- User email
  firstName       String?                     -- First name
  lastName        String?                     -- Last name
  imageUrl        String?                     -- Profile picture URL
  name            String?                     -- Display name
  role            UserRole @default(STUDENT)  -- STUDENT | INSTRUCTOR | ADMIN
  
  -- Relations
  enrollments     Enrollment[]
  messagesSent    ChatMessage[]
  actions         UserAction[]
  instructorCourses Course[] @relation("InstructorCourses")
  quizAttempts    QuizAttempt[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([role])
  @@index([clerkId])
}
```

#### **Courses**
```sql
CREATE TABLE Course (
  id              String @id @default(cuid())
  title           String
  description     String?
  thumbnail       String?
  instructorId    String?                    -- Links to User (instructor)
  duration        Int?                       -- Duration in minutes
  level           String @default("beginner") -- beginner | intermediate | advanced
  price           Float @default(0)          -- Course price
  isPublished     Boolean @default(false)    -- Publication status
  enrollmentCount Int @default(0)            -- Number of enrolled students
  rating          Float @default(0)          -- Average rating
  
  -- Relations
  enrollments     Enrollment[]
  chatRooms       ChatRoom[]
  chapters        Chapter[]
  quizzes         Quiz[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([instructorId])
  @@index([title])
  @@index([isPublished])
}
```

#### **Chapters (Course Content)**
```sql
CREATE TABLE Chapter {
  id              String @id @default(cuid())
  title           String
  description     String?
  position        Int @default(0)            -- Order in course
  courseId        String
  course          Course @relation(...)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([courseId])
}
```

#### **Enrollments**
```sql
CREATE TABLE Enrollment {
  id              String @id @default(cuid())
  userId          String
  user            User @relation(...)
  courseId        String
  course          Course @relation(...)
  status          String @default("ACTIVE")  -- ACTIVE | COMPLETED | DROPPED
  
  createdAt       DateTime @default(now())
  
  @@unique([userId, courseId])              -- One enrollment per user-course pair
  @@index([courseId])
  @@index([userId])
}
```

#### **Quizzes**
```sql
CREATE TABLE Quiz {
  id              String @id @default(cuid())
  title           String
  description     String?
  courseId        String
  course          Course @relation(...)
  isPublished     Boolean @default(false)
  passingScore    Float @default(70)
  
  questions       QuizQuestion[]
  attempts        QuizAttempt[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([courseId])
  @@index([isPublished])
}
```

#### **Quiz Questions & Attempts**
```sql
CREATE TABLE QuizQuestion {
  id              String @id @default(cuid())
  quizId          String
  quiz            Quiz @relation(...)
  question        String
  options         String[]                   -- JSON array of options
  correctAnswer   String
  explanation     String?
  position        Int @default(0)
  
  createdAt       DateTime @default(now())
  
  @@index([quizId])
}

CREATE TABLE QuizAttempt {
  id              String @id @default(cuid())
  userId          String
  user            User @relation(...)
  quizId          String
  quiz            Quiz @relation(...)
  score           Float
  answers         Json                       -- JSON object of answers
  
  createdAt       DateTime @default(now())
  
  @@index([userId])
  @@index([quizId])
}
```

#### **Chat & Messaging**
```sql
CREATE TABLE ChatRoom {
  id              String @id @default(cuid())
  courseId        String
  course          Course @relation(...)
  messages        ChatMessage[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([courseId])
}

CREATE TABLE ChatMessage {
  id              String @id @default(cuid())
  chatRoomId      String
  chatRoom        ChatRoom @relation(...)
  senderId        String
  sender          User @relation("MessagesSentByUser", ...)
  content         String
  
  createdAt       DateTime @default(now())
  
  @@index([chatRoomId])
  @@index([senderId])
}
```

#### **Analytics & Permissions**
```sql
CREATE TABLE UserAction {
  id              String @id @default(cuid())
  userId          String
  user            User @relation(...)
  actionType      String                     -- E.g., "COURSE_VIEWED", "QUIZ_STARTED"
  metadata        Json?
  
  createdAt       DateTime @default(now())
  
  @@index([userId])
  @@index([actionType])
}

CREATE TABLE RolePermission {
  id              String @id @default(cuid())
  role            UserRole
  permission      Permission
  
  @@unique([role, permission])
  @@index([role])
  @@index([permission])
}
```

---

## 🔐 Authentication & Authorization

### Authentication Flow

```
1. User visits app
   ↓
2. Clerk Sign-In/Sign-Up page
   ↓
3. Clerk creates/authenticates user
   ↓
4. JWT token issued to browser
   ↓
5. Next.js middleware intercepts request
   ↓
6. Middleware checks token validity
   ↓
7. If valid → attach user info to request
   ↓
8. If invalid → redirect to sign-in
   ↓
9. Server sync-user.ts creates/updates User in DB
   ↓
10. User role from Clerk public_metadata → stored in DB
```

### Role-Based Access Control (RBAC)

```
Roles:
├── STUDENT
│   ├── View courses
│   ├── Enroll in courses
│   ├── Take quizzes
│   ├── View progress
│   └── Access chat
│
├── INSTRUCTOR
│   ├── All STUDENT permissions
│   ├── Create courses
│   ├── Edit own courses
│   ├── View student analytics
│   ├── Grade assignments
│   └── Manage course content
│
└── ADMIN
    ├── All INSTRUCTOR permissions
    ├── Manage all users
    ├── View platform analytics
    ├── Configure settings
    ├── Manage roles/permissions
    └── Access system logs
```

### Protected Routes

| Route | Auth Required | Role | Description |
|-------|--------------|------|-------------|
| `/` | No | Public | Landing page |
| `/sign-in`, `/sign-up` | No | Public | Auth pages |
| `/courses` | No | Public | Course catalog |
| `/dashboard` | Yes | Any | Role redirector |
| `/dashboard/student/*` | Yes | STUDENT | Student dashboard |
| `/dashboard/instructor/*` | Yes | INSTRUCTOR | Instructor dashboard |
| `/admin/*` | Yes | ADMIN | Admin dashboard |

### Middleware Logic (src/middleware.ts)

```typescript
1. Check if route is public
   ↓
2. If NOT public:
   a. For API routes: return 401 if unauthenticated
   b. For pages: redirect to sign-in
   ↓
3. Check if admin-specific route
   a. If /admin/* → verify role = "admin"
   b. If role ≠ admin → redirect to /unauthorized
   ↓
4. Check dashboard routing
   a. If /dashboard → redirect to role-specific dashboard
   ↓
5. Allow request to proceed
```

---

## 🌐 API Routes

### Authentication Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/webhooks/clerk` | Clerk webhook for sync |

### Course Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/courses` | List all published courses |
| `GET` | `/api/courses/[id]` | Get course details |
| `POST` | `/api/courses` | Create course (instructor) |
| `PUT` | `/api/courses/[id]` | Update course (instructor) |
| `DELETE` | `/api/courses/[id]` | Delete course (instructor) |

### Enrollment Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/enrollments` | Enroll in course |
| `GET` | `/api/enrollments` | Get user enrollments |
| `DELETE` | `/api/enrollments/[id]` | Drop course |

### Admin Endpoints (Requires ADMIN role)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/admin/stats` | Platform statistics |
| `GET` | `/api/admin/users` | List all users |
| `PUT` | `/api/admin/users/[id]` | Update user (change role) |
| `DELETE` | `/api/admin/users/[id]` | Delete user |
| `GET` | `/api/admin/courses` | Manage all courses |

### Permissions Endpoint
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/permissions` | Get user permissions |

---

## 🧩 Component Architecture

### Hierarchy

```
RootLayout (ClerkProvider)
├── Header (Landing page nav)
├── Landing Page
│   ├── Hero
│   ├── Features
│   ├── Pricing
│   └── Footer
│
└── DashboardLayout (Protected)
    ├── Sidebar (Role-based nav)
    ├── Navbar
    ├── MainContent
    │   ├── AdminDashboard
    │   ├── InstructorDashboard
    │   └── StudentDashboard
    └── Footer
```

### Key Components

| Component | Type | Purpose |
|-----------|------|---------|
| `Header` | Client | Top navigation (landing page) |
| `Navbar` | Client | Top navigation (authenticated) |
| `Sidebar` | Client | Side navigation (dashboard) |
| `Dashboard-Layout` | Server | Dashboard page wrapper |
| `Card, Button, Input` | Client | Reusable UI elements |
| `ChatRoom` | Client | Real-time chat interface |

---

## 🔄 State Management

### Server State (Database)
- User profiles, courses, enrollments
- Managed via **Prisma ORM**
- Accessed via API routes or server components

### Client State (React)
- User authentication (Clerk)
- UI state (modals, forms, tabs)
- Managed via React hooks: `useState`, `useContext`

### Hooks
- `useUser()` - Get authenticated user + role
- `usePermissions()` - Get user permissions
- `useClerkUser()` - Raw Clerk user object

---

## 🔒 Security

### Authentication
- **Clerk** for OAuth2/MFA
- JWT tokens verified on every request
- Session management handled by Clerk

### Authorization
- **Role-based access control** (RBAC)
- Route protection via middleware
- API endpoint validation

### Data Protection
- **HTTPS only** in production
- **CORS** configured for security
- **Environment variables** for sensitive keys
- **Prisma** prevents SQL injection

### Database Security
- **Unique constraints** prevent duplicates
- **Cascade deletes** maintain referential integrity
- **Indexes** prevent N+1 queries
- **Transactions** for data consistency

---

## 📊 Performance Optimizations

### Database
- Strategic indexing on frequently queried fields
- Pagination for large datasets
- Query optimization with Prisma `select` & `include`

### Frontend
- **Turbopack** for faster builds
- **Next.js Image** optimization
- **Code splitting** with dynamic imports
- **CSS-in-JS** with Tailwind (no runtime overhead)

### Caching
- **ISR** (Incremental Static Regeneration) for pages
- **Browser caching** for static assets
- **CDN** recommended for production

---

## 🚀 Deployment

### Recommended Hosting
- **Vercel** (Next.js optimized)
- **AWS** (EC2 + RDS)
- **DigitalOcean** (App Platform)
- **Railway** (Simple alternative)

See `DEPLOYMENT.md` for detailed instructions.

---

**Created**: November 11, 2025  
**Project**: SkillSyncAI v0.1.0  
**Architecture**: Modern Full-Stack with Next.js 15 & Prisma
