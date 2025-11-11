# 🚀 SkillSyncAI - Complete Setup Guide

**Last Updated**: November 11, 2025  
**Project**: AI-LMS (SkillSyncAI) - Production Ready  
**Status**: ✅ Ready for Deployment

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Database Configuration](#database-configuration)
4. [Environment Variables](#environment-variables)
5. [Running the Application](#running-the-application)
6. [Verification Checklist](#verification-checklist)

---

## ✅ Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Node.js** v18+ or v20+ (LTS recommended)
- **npm** v9+ or **yarn**
- **PostgreSQL** v14+ (local or remote)
- **Git** v2.40+

### Third-Party Accounts
- **Clerk** (Authentication) - [https://clerk.com](https://clerk.com)
- **Supabase** (Database & Storage) - [https://supabase.com](https://supabase.com)
- **OpenAI** (AI Features) - [https://openai.com](https://openai.com)

### Verify Installation
```powershell
node --version          # Should be v18.0.0 or higher
npm --version           # Should be v9.0.0 or higher
postgresql --version    # Should be v14.0 or higher
```

---

## 📦 Project Setup

### Step 1: Clone & Install Dependencies

```powershell
# Navigate to your projects directory
cd c:\Users\pawan\projects\

# Clone repository (if not already done)
git clone https://github.com/LeveL-P1/AI-LMS.git
cd AI-LMS

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

### Step 2: Verify Project Structure

```
AI-LMS/
├── src/
│   ├── app/                    # Next.js 15 app directory
│   ├── components/             # Reusable React components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and configurations
│   ├── types/                  # TypeScript type definitions
│   └── middleware.ts           # Next.js middleware
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts                # Database seeding script
├── pages/
│   ├── api/                   # API routes
│   └── [dynamic routes]
├── public/                     # Static assets
└── package.json
```

---

## 🗄️ Database Configuration

### Option A: Local PostgreSQL Setup

#### Windows (via Windows Subsystem for Linux 2 - WSL2)

```powershell
# Install WSL2 and PostgreSQL from Microsoft Store, or use Chocolatey
choco install postgresql

# Start PostgreSQL
pg_ctl -D "C:\Program Files\PostgreSQL\data" start

# Create database
createdb skillsyncai

# Verify connection
psql -U postgres -d skillsyncai -c "SELECT version();"
```

#### Windows (via Docker)

```powershell
# Pull PostgreSQL image
docker pull postgres:15

# Run PostgreSQL container
docker run --name skillsyncai-db `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=skillsyncai `
  -p 5432:5432 `
  -d postgres:15

# Verify
docker ps
```

### Option B: Use Supabase (Recommended for Production)

1. Go to [https://supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Copy connection string from Settings → Database → URI
4. Database URL format: `postgresql://postgres:password@host:5432/skillsyncai`

---

## 🔐 Environment Variables

### Step 1: Create `.env.local` File

Copy the template and fill in your values:

```powershell
cp .env.local.example .env.local
```

### Step 2: Configure Each Section

#### **Database**
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/skillsyncai"
DIRECT_URL="postgresql://postgres:yourpassword@localhost:5432/skillsyncai"
```

#### **Clerk Authentication**

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Create application
3. Go to API Keys
4. Copy and paste:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"
```

#### **Supabase (for Storage)**

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project → Settings → API
3. Copy:

```
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJxxx..."
SUPABASE_SERVICE_ROLE_KEY="eyJxxx..."
```

#### **OpenAI (for AI Features)**

1. Go to [https://platform.openai.com](https://platform.openai.com/account/api-keys)
2. Create API key
3. Copy:

```
OPENAI_API_KEY="sk-..."
```

#### **Webhooks & Environment**

```
CLERK_WEBHOOK_SECRET="whsec_..."
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 3: Verify Variables

```powershell
# Test database connection
npx prisma db execute --stdin
SELECT NOW();

# Test Clerk connection (will show in logs on app startup)
npm run dev
```

---

## 🚀 Running the Application

### Development Mode

```powershell
# Start development server with turbopack
npm run dev

# Open browser
Start-Process "http://localhost:3000"

# Logs should show:
# ▲ Next.js 15.4.1
# - Local:        http://localhost:3000
# - Environments: .env.local
```

### Database Migration (First Time Only)

```powershell
# Review schema changes
npx prisma migrate status

# Create and apply migration
npm run db:push

# Seed database with sample data (optional)
npm run db:seed

# Open Prisma Studio to view data
npm run db:studio
```

### Production Build

```powershell
# Build for production
npm run build

# Start production server
npm start

# Should display: ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## ✅ Verification Checklist

### Pre-Launch Verification

- [ ] **Node.js & npm**
  ```powershell
  node --version
  npm --version
  ```

- [ ] **PostgreSQL Connection**
  ```powershell
  npx prisma db execute --stdin
  SELECT 1;
  ```

- [ ] **Environment Variables Loaded**
  ```powershell
  npm run dev
  # Check console for any missing variable warnings
  ```

- [ ] **Database Schema Created**
  ```powershell
  npm run db:push
  # Should show: "Everything is up to date"
  ```

- [ ] **Application Starts**
  ```powershell
  npm run dev
  # Should see: "ready started server on 0.0.0.0:3000"
  ```

- [ ] **Pages Accessible**
  - [ ] Landing page: http://localhost:3000
  - [ ] Sign in: http://localhost:3000/sign-in
  - [ ] Sign up: http://localhost:3000/sign-up
  - [ ] Courses: http://localhost:3000/courses (public, no auth needed)

- [ ] **Authentication Works**
  - [ ] Create account
  - [ ] Sign in
  - [ ] Redirect to dashboard
  - [ ] Role-based access (Student/Instructor/Admin)

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Port 3000 already in use** | `npx kill-port 3000` or use `npm run dev -- -p 3001` |
| **Database connection refused** | Verify PostgreSQL is running: `pg_ctl status` |
| **Clerk authentication fails** | Check `.env.local` has correct publishable & secret keys |
| **Prisma type errors** | Run `npx prisma generate` to regenerate types |
| **Module not found errors** | Delete `node_modules` and `.next`, then run `npm install && npm run build` |

---

## 📚 Project Architecture Overview

```
Authentication Flow:
┌─────────────────┐
│   User Signs In │
│   via Clerk     │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Middleware     │  ← src/middleware.ts (protects routes)
│  Checks Role    │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Role-Based      │  ← /admin, /instructor, /student
│ Dashboards      │
└─────────────────┘

Database Schema:
┌──────────┐  ┌────────────┐  ┌───────────┐
│  Users   │--│ Enrollments│--│  Courses  │
└──────────┘  └────────────┘  └───────────┘
     │                              │
     │                         ┌────┴──────┐
     │                         ↓           ↓
     │                     ┌────────┐  ┌────────┐
     │                     │Chapters│  │ Quizzes│
     │                     └────────┘  └────────┘
     │
     └──────────────────┬─────────────────┐
                        ↓                 ↓
                   ┌────────────┐   ┌──────────────┐
                   │ChatMessage │   │QuizAttempts  │
                   └────────────┘   └──────────────┘
```

---

## 🔄 Next Steps After Setup

1. **Configure Admin Account**
   - Sign up as first user
   - Update user role to `ADMIN` in database
   - Access `/admin` dashboard

2. **Create Test Content**
   - Create sample courses
   - Add chapters/lessons
   - Add quizzes

3. **Test Role-Based Features**
   - Create courses as instructor
   - Enroll as student
   - View analytics as admin

4. **Deploy to Production** (See `DEPLOYMENT.md`)

---

## 📞 Support & Troubleshooting

For detailed troubleshooting, see:
- 📖 [ARCHITECTURE.md](./ARCHITECTURE.md) - System design & tech stack
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions
- 📋 [package.json](./package.json) - Available scripts

---

**Created**: November 11, 2025  
**Project**: SkillSyncAI v0.1.0  
**Status**: ✅ Production Ready
