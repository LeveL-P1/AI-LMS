import { UserRole } from '@/types'

export type Permission = 
  | 'CREATE_COURSE'
  | 'EDIT_COURSE'
  | 'DELETE_COURSE'
  | 'VIEW_COURSE'
  | 'SUBMIT_ASSIGNMENT'
  | 'GRADE_ASSIGNMENT'
  | 'VIEW_ANALYTICS'
  | 'MANAGE_USERS'

// Define role-permission mappings
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    'CREATE_COURSE',
    'EDIT_COURSE', 
    'DELETE_COURSE',
    'VIEW_COURSE',
    'SUBMIT_ASSIGNMENT',
    'GRADE_ASSIGNMENT',
    'VIEW_ANALYTICS',
    'MANAGE_USERS'
  ],
  [UserRole.INSTRUCTOR]: [
    'CREATE_COURSE',
    'EDIT_COURSE',
    'VIEW_COURSE',
    'GRADE_ASSIGNMENT',
    'VIEW_ANALYTICS'
  ],
  [UserRole.STUDENT]: [
    'VIEW_COURSE',
    'SUBMIT_ASSIGNMENT'
  ]
}

// Helper functions for role management
export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}

export function canPerformAction(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false
}

export function getRoleHierarchy(): UserRole[] {
  return [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT]
}

export function isHigherRole(role1: UserRole, role2: UserRole): boolean {
  const hierarchy = getRoleHierarchy()
  return hierarchy.indexOf(role1) < hierarchy.indexOf(role2)
}

export function hasAccessToResource(userRole: UserRole, requiredRole: UserRole): boolean {
  const hierarchy = getRoleHierarchy()
  return hierarchy.indexOf(userRole) <= hierarchy.indexOf(requiredRole)
}