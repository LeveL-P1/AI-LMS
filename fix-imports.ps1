# Get all TypeScript and JavaScript files
$files = Get-ChildItem -Path "src" -Recurse -Include "*.ts","*.tsx","*.js","*.jsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    if ($content) {
        # Update import paths
        $content = $content -replace '@/lib/constants', '@/lib/utils/constants'
        $content = $content -replace '@/lib/utils"', '@/lib/utils/utils"'
        $content = $content -replace '@/lib/prisma"', '@/lib/prisma/prisma"'
        $content = $content -replace '@/components/ui/', '@/components/common/ui/'
        $content = $content -replace 'from "\./prisma"', 'from "@/lib/prisma/prisma"'
        $content = $content -replace 'from "\./utils"', 'from "@/lib/utils/utils"'
        
        # Save the updated content
        Set-Content -Path $file.FullName -Value $content
    }
}

Write-Host "Import paths updated successfully!"