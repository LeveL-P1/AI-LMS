export {}

// User roles matching database schema
export type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT'

// Permissions matching database schema
export type Permission = 
  | 'CREATE_COURSE'
  | 'EDIT_COURSE' 
  | 'DELETE_COURSE'
  | 'VIEW_COURSE'
  | 'SUBMIT_ASSIGNMENT'
  | 'GRADE_ASSIGNMENT'
  | 'VIEW_ANALYTICS'
  | 'MANAGE_USERS'

// Extended session claims with database role
declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: UserRole
      userId?: string
    }
  }
}