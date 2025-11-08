# Get all TypeScript and JavaScript files
$files = Get-ChildItem -Path "src" -Recurse -Include "*.ts","*.tsx","*.js","*.jsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Update import paths
    $content = $content -replace '@/components/ui/', '@/components/common/ui/'
    $content = $content -replace '@/lib/utils', '@/lib/utils/utils'
    $content = $content -replace '@/lib/prisma', '@/lib/prisma/prisma'
    $content = $content -replace '@/app/student/', '@/app/(roles)/student/'
    $content = $content -replace '@/app/instructor/', '@/app/(roles)/instructor/'
    $content = $content -replace '@/app/admin/', '@/app/(roles)/admin/'
    
    # Save the updated content
    Set-Content -Path $file.FullName -Value $content
}

Write-Host "Import paths updated successfully!"