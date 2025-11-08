# Create new directories first
$directories = @(
    "src/app/(roles)/student/courses/browse",
    "src/app/(roles)/student/courses/[courseId]/learn",
    "src/app/(roles)/student/courses/[courseId]/quiz",
    "src/app/(roles)/student/assignments",
    "src/app/(roles)/student/progress",
    "src/app/(roles)/student/quizzes",
    "src/app/(roles)/instructor/courses/create",
    "src/app/(roles)/instructor/courses/[courseId]/assignments",
    "src/app/(roles)/instructor/courses/[courseId]/edit",
    "src/app/(roles)/instructor/courses/[courseId]/lessons",
    "src/app/(roles)/instructor/courses/[courseId]/students",
    "src/app/(roles)/instructor/analytics",
    "src/app/(roles)/instructor/students",
    "src/app/(roles)/admin/courses",
    "src/app/(roles)/admin/users",
    "src/app/(roles)/admin/settings",
    "src/components/common/ui",
    "src/lib/prisma",
    "src/lib/utils",
    "src/lib/auth"
)

foreach ($dir in $directories) {
    New-Item -Path $dir -ItemType Directory -Force
}

# Move files to their new locations
# Student related files
Move-Item -Path "src/app/student/assignments/*" -Destination "src/app/(roles)/student/assignments/" -Force
Move-Item -Path "src/app/student/courses/*" -Destination "src/app/(roles)/student/courses/" -Force
Move-Item -Path "src/app/student/progress/*" -Destination "src/app/(roles)/student/progress/" -Force
Move-Item -Path "src/app/student/quizzes/*" -Destination "src/app/(roles)/student/quizzes/" -Force

# Instructor related files
Move-Item -Path "src/app/instructor/analytics/*" -Destination "src/app/(roles)/instructor/analytics/" -Force
Move-Item -Path "src/app/instructor/courses/*" -Destination "src/app/(roles)/instructor/courses/" -Force
Move-Item -Path "src/app/instructor/students/*" -Destination "src/app/(roles)/instructor/students/" -Force

# Admin related files
Move-Item -Path "src/app/admin/courses/*" -Destination "src/app/(roles)/admin/courses/" -Force
Move-Item -Path "src/app/admin/users/*" -Destination "src/app/(roles)/admin/users/" -Force
Move-Item -Path "src/app/admin/settings/*" -Destination "src/app/(roles)/admin/settings/" -Force

# Move UI components
Move-Item -Path "src/components/ui/*" -Destination "src/components/common/ui/" -Force

# Move lib files
Move-Item -Path "src/lib/prisma.ts" -Destination "src/lib/prisma/" -Force
Move-Item -Path "prisma/*" -Destination "src/lib/prisma/" -Force
Move-Item -Path "src/lib/utils.ts" -Destination "src/lib/utils/" -Force
Move-Item -Path "src/lib/constants.ts" -Destination "src/lib/utils/" -Force
Move-Item -Path "src/lib/sync-user.ts" -Destination "src/lib/auth/" -Force
Move-Item -Path "src/lib/testAuth.ts" -Destination "src/lib/auth/" -Force

# Clean up empty directories
Remove-Item -Path "src/app/student" -Recurse -Force
Remove-Item -Path "src/app/instructor" -Recurse -Force
Remove-Item -Path "src/app/admin" -Recurse -Force
Remove-Item -Path "src/components/ui" -Force

Write-Host "Project restructuring completed successfully!"