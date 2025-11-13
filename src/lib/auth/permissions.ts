import { UserRole, Permission } from '@/types/globals'

// Define role-permission mappings
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    'CREATE_COURSE',
    'EDIT_COURSE', 
    'DELETE_COURSE',
    'VIEW_COURSE',
    'SUBMIT_ASSIGNMENT',
    'GRADE_ASSIGNMENT',
    'VIEW_ANALYTICS',
    'MANAGE_USERS'
  ],
  INSTRUCTOR: [
    'CREATE_COURSE',
    'EDIT_COURSE',
    'VIEW_COURSE',
    'GRADE_ASSIGNMENT',
    'VIEW_ANALYTICS'
  ],
  STUDENT: [
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
  return ['ADMIN', 'INSTRUCTOR', 'STUDENT']
}

export function isHigherRole(role1: UserRole, role2: UserRole): boolean {
  const hierarchy = getRoleHierarchy()
  return hierarchy.indexOf(role1) < hierarchy.indexOf(role2)
}