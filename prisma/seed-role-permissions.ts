import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Define role-permission mappings directly
const ROLE_PERMISSIONS = {
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

async function main() {
  console.log('🌱 Seeding role permissions...')

  // Clear existing role permissions
  await prisma.rolePermission.deleteMany()
  console.log('🗑️  Cleared existing role permissions')

  // Create role permissions based on our mapping
  const rolePermissions: any[] = []
  
  for (const [role, permissions] of Object.entries(ROLE_PERMISSIONS)) {
    for (const permission of permissions) {
      rolePermissions.push({
        id: `${role}_${permission}`,
        role: role,
        permission: permission
      })
    }
  }

  // Bulk create role permissions
  await prisma.rolePermission.createMany({
    data: rolePermissions,
    skipDuplicates: true
  })

  console.log('✅ Created role permissions:')
  for (const [role, permissions] of Object.entries(ROLE_PERMISSIONS)) {
    console.log(`  ${role}: ${permissions.join(', ')}`)
  }

  console.log('🎉 Role permissions seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding role permissions:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })