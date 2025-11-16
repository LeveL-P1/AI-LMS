import { z } from 'zod'

// Course validation
export const createCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  thumbnail: z.string().url().optional(),
})

export const updateCourseSchema = createCourseSchema.extend({
  isPublished: z.boolean().optional(),
})

export type CreateCourseInput = z.infer<typeof createCourseSchema>
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>

// Enrollment validation
export const enrollmentSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
})

export type EnrollmentInput = z.infer<typeof enrollmentSchema>

// Quiz validation
export const createQuizSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().optional(),
  passingScore: z.number().min(0).max(100).default(70),
})

export const quizQuestionSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  options: z.array(z.string()).min(2, 'At least 2 options required').max(6),
  correctAnswer: z.string(),
  explanation: z.string().optional(),
  position: z.number().default(0),
})

export const submitQuizSchema = z.object({
  quizId: z.string().min(1, 'Quiz ID is required'),
  answers: z.record(z.string(), z.string()),
})

export type CreateQuizInput = z.infer<typeof createQuizSchema>
export type QuizQuestionInput = z.infer<typeof quizQuestionSchema>
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>

// Assignment validation
export const createAssignmentSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  maxScore: z.number().min(0).default(100),
})

export const submitAssignmentSchema = z.object({
  assignmentId: z.string().min(1, 'Assignment ID is required'),
  content: z.string().optional(),
  fileUrl: z.string().url().optional(),
})

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>
export type SubmitAssignmentInput = z.infer<typeof submitAssignmentSchema>

// Chapter validation
export const createChapterSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().url().optional(),
  position: z.number().default(0),
})

export type CreateChapterInput = z.infer<typeof createChapterSchema>

// Pagination validation
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
})

export type PaginationInput = z.infer<typeof paginationSchema>
