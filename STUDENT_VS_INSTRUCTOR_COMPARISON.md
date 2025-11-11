# Student vs Instructor Pages - Comparison Guide

## Overview
This document provides a comprehensive comparison between Student and Instructor role pages to understand the different flows, features, and responsibilities.

---

## Page Structure Comparison

### Dashboard/Landing Pages

| Feature | Student | Instructor |
|---------|---------|-----------|
| **URL** | (auth redirects to `/student/courses`) | `/instructor` |
| **Purpose** | Not applicable (direct to courses) | Main control center |
| **Key Sections** | — | Dashboard with stats & quick actions |
| **Main Action** | Browse/enroll in courses | Create new course |
| **Stats Shown** | — | Courses, Students, Ratings, Active status |

---

## Course Management

### View Courses

| Aspect | Student | Instructor |
|--------|---------|-----------|
| **URL** | `/student/courses` | `/instructor/courses` |
| **Shows** | Enrolled courses only | All created courses |
| **Layout** | Card grid with progress bars | Card grid with enrollment counts |
| **Actions** | View course | View or Edit course |
| **Data Source** | Enrollments for current user | Courses where user is instructor |
| **Status** | Progress percentage | Active/Draft status |

```typescript
// Student Query
enrollments = await db.enrollment.findMany({
  where: { userId: student.id }
})

// Instructor Query
courses = await db.course.findMany({
  where: { instructorId: instructor.id }
})
```

### Create Course

| Aspect | Student | Instructor |
|--------|---------|-----------|
| **Can Create** | ✗ No | ✓ Yes |
| **Form Fields** | — | Title, Description |
| **Database Action** | — | `course.create()` |
| **Redirect After** | — | Course detail page |

```typescript
// Instructor Only
await db.course.create({
  data: {
    title,
    description,
    instructorId: userId
  }
})
```

### Course Detail Pages

| Feature | Student | Instructor |
|---------|---------|-----------|
| **URL** | `/courses/[courseId]` (public) | `/instructor/courses/[courseId]` |
| **Can Enroll** | ✓ Yes | ✗ No |
| **Can Edit** | ✗ No | ✓ Yes (via edit button) |
| **Shows Lessons** | ✓ Yes (after enrollment) | ✓ Yes (manage button) |
| **Stats Shown** | Description, instructor | Enrollments, status, assignments |
| **Key Actions** | Enroll / View lessons | Manage lessons/assignments/students |

### Edit Course

| Aspect | Student | Instructor |
|--------|---------|-----------|
| **Can Edit** | ✗ No | ✓ Yes |
| **URL** | N/A | `/instructor/courses/[courseId]/edit` |
| **Editable Fields** | N/A | Title, Description |
| **Permission Check** | N/A | Verify instructor ownership |

```typescript
// Instructor Only - Edit
if (course.instructorId !== userId) redirect('/unauthorized')

await db.course.update({
  where: { id: courseId },
  data: { title, description }
})
```

---

## Content Management

### Lessons

| Aspect | Student | Instructor |
|--------|---------|-----------|
| **View Lessons** | ✓ Yes - in `/courses/[courseId]/lessons/[lessonId]` | ✓ Yes - manage at `/instructor/courses/[courseId]/lessons` |
| **Create Lessons** | ✗ No | ✓ Yes (placeholder) |
| **Edit Lessons** | ✗ No | ✓ Yes (placeholder) |
| **Delete Lessons** | ✗ No | ✓ Yes (placeholder) |

### Assignments

| Aspect | Student | Instructor |
|--------|---------|-----------|
| **View Assignments** | ✓ Yes (my submissions) at `/student/assignments` | ✓ Yes (all submissions) at `/instructor/courses/[courseId]/assignments` |
| **Submit Assignments** | ✓ Yes | ✗ No |
| **Grade Assignments** | ✗ No | ✓ Yes (placeholder) |
| **View Feedback** | ✓ Yes | ✓ Yes (to provide) |
| **Submission Status** | Pending/Graded | Submitted/Pending grading |

**Student Assignment Page:**
```typescript
// View own submissions
const submissions = [
  { title, submittedAt, status, grade, feedback }
]

// Can download and resubmit
```

**Instructor Assignment Page:**
```typescript
// View all submissions
const assignments = [
  { title, dueDate, totalSubmissions, graded, pending }
]

// Can grade and provide feedback
```

---

## Student Management

### View Students

| Aspect | Student | Instructor |
|--------|---------|-----------|
| **Can View All Students** | ✗ No (only in their courses) | ✓ Yes - at `/instructor/students` |
| **Can View Classmates** | ✓ In their courses (future) | ✓ Yes - per course at `/instructor/courses/[courseId]/students` |
| **Data Available** | Name, email | Name, email, enrollment date, progress |
| **Actions** | Message/collaborate (future) | View progress, manage enrollment |

**Instructor Views:**
1. All Students: `/instructor/students`
   - Unified view across all courses
   - Student info table with emails

2. Course Students: `/instructor/courses/[courseId]/students`
   - Students in specific course only
   - Enrollment-specific data
   - Quick stats

---

## Analytics & Progress

### Student Progress Tracking

| Aspect | Details |
|--------|---------|
| **URL** | `/student/progress` |
| **Shows** | Personal learning progress |
| **Metrics** | Lessons completed, courses in progress |
| **View** | Courses with completion bars |

```typescript
// Student Progress Query
enrollments = await db.enrollment.findMany({
  where: { userId: studentId }
})
// Calculate: completed_lessons / total_lessons for each course
```

### Instructor Analytics

| Aspect | Details |
|--------|---------|
| **URL** | `/instructor/analytics` |
| **Shows** | Teaching performance metrics |
| **Metrics** | Total courses, students, ratings, engagement |
| **View** | Course performance, student engagement |

```typescript
// Instructor Analytics Query
courses = await db.course.findMany({
  where: { instructorId: instructorId }
})
// Calculate: enrollments per course, engagement rate
// Aggregate: total students, average metrics
```

---

## Comparative Features Matrix

```
Feature                  | Student | Instructor | Available
───────────────────────────────────────────────────────────
Dashboard               | ✗       | ✓          | v1
Course Browsing         | ✓       | ✗          | v1
Course Creation         | ✗       | ✓          | v1
Course Editing          | ✗       | ✓          | v1
Lesson Viewing          | ✓       | ✓          | v1
Lesson Creation         | ✗       | ◐          | future
Assignment Submission   | ✓       | ✗          | v1
Assignment Grading      | ✗       | ◐          | future
Progress Tracking       | ✓       | ✓          | v1
Student Analytics       | ✓ own   | ✓ all      | v1
Messaging              | ✗       | ✗          | future
Chat Rooms             | ✗       | ✗          | future
Discussion Forums      | ✗       | ✗          | future
Certificate            | ✗       | ✓ issue    | future
```

Legend: ✓ Complete | ◐ Partial | ✗ Not available

---

## Authentication & Authorization

### Authorization Checks

**Student Pages:**
```typescript
// Only need: Logged in
const { userId } = await auth()
if (!userId) redirect('/sign-in')

// All courses are public view (after enrollment)
```

**Instructor Pages:**
```typescript
// Need: Logged in + Instructor role
const { userId } = await auth()
if (!userId) redirect('/sign-in')

// Plus: Verify course ownership
if (course.instructorId !== userId) {
  redirect('/unauthorized')
}
```

---

## Database Query Patterns

### Student Queries
```typescript
// Get enrolled courses
db.enrollment.findMany({
  where: { userId: studentId },
  include: { course: true }
})

// Get own actions/progress
db.userAction.findMany({
  where: { userId: studentId }
})
```

### Instructor Queries
```typescript
// Get all courses
db.course.findMany({
  where: { instructorId: instructorId },
  include: { enrollments: true }
})

// Get course students
db.enrollment.findMany({
  where: { courseId: courseId },
  include: { user: true }
})
```

---

## UI/UX Differences

### Student Interface
- Focus on: Learning, progress, submissions
- Colors: Blues, greens (learning progress)
- Navigation: My Courses → Browse → Progress → Assignments
- Actions: View, Submit, Track progress

### Instructor Interface
- Focus on: Teaching, management, analytics
- Colors: Blues, purples (management)
- Navigation: Dashboard → Courses → Students → Analytics
- Actions: Create, Edit, Grade, Analyze

---

## Form Patterns

### Student Forms
```tsx
// Assignment submission
<form action={submitAssignment}>
  <input name="file" type="file" />
  <input name="notes" type="text" />
  <button type="submit">Submit</button>
</form>
```

### Instructor Forms
```tsx
// Course creation/editing
<form action={createCourse}>
  <input name="title" type="text" required />
  <textarea name="description" required />
  <button type="submit">Create/Save</button>
</form>
```

---

## Navigation Flows

### Student Navigation Flow
```
Landing Page (/courses)
├── Browse Courses (/courses)
│   └── Enroll in Course
├── My Courses (/student/courses)
│   └── View Course (/courses/[courseId])
│       ├── View Lessons (/courses/[courseId]/lessons/[lessonId])
│       └── Take Quiz (/courses/[courseId]/quiz/[quizId])
├── Assignments (/student/assignments)
├── My Progress (/student/progress)
└── Quizzes (/student/quizzes)
```

### Instructor Navigation Flow
```
Instructor Dashboard (/instructor)
├── My Courses (/instructor/courses)
│   ├── Create Course (/instructor/courses/create)
│   └── Course Detail (/instructor/courses/[courseId])
│       ├── Edit Course (/instructor/courses/[courseId]/edit)
│       ├── Manage Lessons (/instructor/courses/[courseId]/lessons)
│       ├── Manage Assignments (/instructor/courses/[courseId]/assignments)
│       └── View Students (/instructor/courses/[courseId]/students)
├── All Students (/instructor/students)
└── Analytics (/instructor/analytics)
```

---

## API/Action Requirements

### Student Side
- Enrollment creation/cancellation
- Assignment submission
- Progress tracking
- Quiz submission
- Personal profile updates

### Instructor Side
- Course CRUD operations
- Lesson management
- Assignment creation/grading
- Student management
- Analytics data aggregation
- Feedback provision

---

## Performance Considerations

### Student Pages
- Cache enrolled courses list
- Preload next lesson content
- Optimize progress calculations

### Instructor Pages
- Cache course statistics
- Preload student analytics
- Optimize enrollment queries

---

## Future Enhancements

### Student Features
- Discussion participation
- Peer feedback
- Progress notifications
- Personalized recommendations

### Instructor Features
- Automated grading (AI)
- Attendance tracking
- Student behavior analysis
- Course recommendations
- Batch operations
- Export to external tools

---

## Related Documentation

- `INSTRUCTOR_PAGES_DOCUMENTATION.md` - Detailed instructor pages
- `Student Pages` - Located in `/src/app/(roles)/student/`
- `Database Schema` - `/prisma/schema.prisma`
