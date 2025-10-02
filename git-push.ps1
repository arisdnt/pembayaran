# Git Push Script dengan Timestamp
# Script untuk melakukan git add, commit dengan timestamp, dan push

param(
    [string]$Message = "Update",
    [string]$Branch = "main"
)

# Fungsi untuk membuat timestamp
function Get-Timestamp {
    return Get-Date -Format "yyyy-MM-dd HH:mm:ss"
}

# Warna output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

try {
    Write-ColorOutput Green "🚀 Memulai Git Push Script..."
    Write-Host ""

    # Cek apakah di dalam git repository
    if (!(Test-Path ".git")) {
        Write-ColorOutput Red "❌ Error: Tidak berada dalam git repository!"
        exit 1
    }

    # Cek status git
    Write-ColorOutput Yellow "📋 Mengecek status git..."
    $status = git status --porcelain
    
    if (!$status) {
        Write-ColorOutput Yellow "⚠️  Tidak ada perubahan untuk di-commit."
        Write-ColorOutput Yellow "🌐 Melakukan push langsung..."
    } else {
        # Tampilkan files yang akan di-commit
        Write-ColorOutput Cyan "📁 Files yang akan di-commit:"
        git status --short
        Write-Host ""
    }

    # Buat commit message dengan timestamp
    $timestamp = Get-Timestamp
    $commitMessage = "$Message - $timestamp"
    
    Write-ColorOutput Yellow "💬 Commit message: $commitMessage"
    Write-Host ""

    # Git add semua files
    if ($status) {
        Write-ColorOutput Yellow "📤 Menambahkan files ke staging..."
        git add .
        
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput Red "❌ Error saat git add!"
            exit 1
        }
        
        # Git commit
        Write-ColorOutput Yellow "💾 Melakukan commit..."
        git commit -m $commitMessage
        
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput Red "❌ Error saat git commit!"
            exit 1
        }
    }

    # Git push
    Write-ColorOutput Yellow "🌐 Melakukan push ke remote repository..."
    git push origin $Branch
    
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput Red "❌ Error saat git push!"
        exit 1
    }

    Write-Host ""
    Write-ColorOutput Green "🎉 Berhasil! Code telah di-push ke repository."
    Write-ColorOutput Green "📅 Commit: $commitMessage"
    Write-ColorOutput Green "🌿 Branch: $Branch"

} catch {
    Write-ColorOutput Red "❌ Error: $($_.Exception.Message)"
    exit 1
}

# Tampilkan log commit terakhir
Write-Host ""
Write-ColorOutput Cyan "📜 Commit terakhir:"
git log --oneline -1