# Dependabot PR Management Script
# This script helps manage and merge Dependabot PRs systematically

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("list", "test-all", "merge-critical", "merge-medium", "merge-low", "validate")]
    [string]$Action = "list",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun = $false
)

# Color output helpers
function Write-Priority {
    param([string]$Message, [string]$Priority)
    switch ($Priority) {
        "CRITICAL" { Write-Host "🔴 $Message" -ForegroundColor Red }
        "MEDIUM"   { Write-Host "🟡 $Message" -ForegroundColor Yellow }
        "LOW"      { Write-Host "🟢 $Message" -ForegroundColor Green }
        default    { Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
    }
}

# PR Definitions
$CriticalPRs = @(
    @{Number=27; Title="Bump axios from 1.13.4 to 1.13.5"; Location="root"; Reason="DoS vulnerability fix"}
    @{Number=26; Title="Bump axios in /api/proxy-projects"; Location="api/proxy-projects"; Reason="DoS vulnerability fix"}
    @{Number=25; Title="Bump axios in /api/proxy-joke"; Location="api/proxy-joke"; Reason="DoS vulnerability fix"}
)

$MediumPRs = @(
    @{Number=21; Title="Bump jws"; Location="root"; Reason="JWT security"}
    @{Number=20; Title="Bump mdast-util-to-hast"; Location="root"; Reason="Markdown utility"}
    @{Number=18; Title="Bump node-forge"; Location="root"; Reason="Cryptography lib"}
)

$LowPRs = @(
)

function Show-PRList {
    Write-Host "`n=== DEPENDABOT PR MANAGEMENT ===" -ForegroundColor Cyan
    Write-Host "`nTotal PRs: " -NoNewline
    $total = $CriticalPRs.Count + $MediumPRs.Count + $LowPRs.Count
    Write-Host "$total" -ForegroundColor White
    
    Write-Host "`n🔴 CRITICAL SECURITY FIXES ($($CriticalPRs.Count)):" -ForegroundColor Red
    foreach ($pr in $CriticalPRs) {
        Write-Host "  #$($pr.Number): $($pr.Title)" -ForegroundColor Red
        Write-Host "    Location: $($pr.Location) | Reason: $($pr.Reason)" -ForegroundColor Gray
    }
    
    Write-Host "`n🟡 MEDIUM PRIORITY ($($MediumPRs.Count)):" -ForegroundColor Yellow
    foreach ($pr in $MediumPRs) {
        Write-Host "  #$($pr.Number): $($pr.Title)" -ForegroundColor Yellow
        Write-Host "    Location: $($pr.Location) | Reason: $($pr.Reason)" -ForegroundColor Gray
    }
    
    Write-Host "`n🟢 LOW PRIORITY ($($LowPRs.Count)):" -ForegroundColor Green
    foreach ($pr in $LowPRs) {
        Write-Host "  #$($pr.Number): $($pr.Title)" -ForegroundColor Green
        Write-Host "    Location: $($pr.Location) | Reason: $($pr.Reason)" -ForegroundColor Gray
    }
    
    Write-Host "`nNext Steps:" -ForegroundColor Cyan
    Write-Host "  1. Run: .\manage-dependabot.ps1 -Action test-all" -ForegroundColor White
    Write-Host "  2. Run: .\manage-dependabot.ps1 -Action merge-critical" -ForegroundColor White
    Write-Host "  3. Monitor for 24h, then run merge-medium and merge-low" -ForegroundColor White
}

function Test-All {
    Write-Host "`n=== RUNNING TEST SUITE ===" -ForegroundColor Cyan
    
    Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm install failed!" -ForegroundColor Red
        return $false
    }
    
    Write-Host "`n🧪 Running tests..." -ForegroundColor Yellow
    npm test
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Tests failed!" -ForegroundColor Red
        return $false
    }
    
    Write-Host "`n🔨 Building project..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        return $false
    }
    
    Write-Host "`n✅ All tests passed!" -ForegroundColor Green
    return $true
}

function Merge-PRGroup {
    param([array]$PRs, [string]$Priority)
    
    Write-Host "`n=== MERGING $Priority PRIORITY PRs ===" -ForegroundColor Cyan
    
    foreach ($pr in $PRs) {
        Write-Priority -Message "Processing PR #$($pr.Number): $($pr.Title)" -Priority $Priority
        
        if ($DryRun) {
            Write-Host "  [DRY RUN] Would merge PR #$($pr.Number)" -ForegroundColor Gray
            continue
        }
        
        # Instructions for manual merge (GitHub CLI would go here)
        Write-Host "`n  To merge this PR:" -ForegroundColor Cyan
        Write-Host "  1. Open: https://github.com/markhazleton/ReactSparkPortfolio/pull/$($pr.Number)" -ForegroundColor White
        Write-Host "  2. Comment: @dependabot rebase" -ForegroundColor White
        Write-Host "  3. Wait for CI checks to pass" -ForegroundColor White
        Write-Host "  4. Click 'Approve and Merge'" -ForegroundColor White
        
        $continue = Read-Host "`n  Have you merged PR #$($pr.Number)? (y/n)"
        if ($continue -ne 'y') {
            Write-Host "  ⏸️  Skipping PR #$($pr.Number)" -ForegroundColor Yellow
            continue
        }
        
        Write-Host "  ✅ PR #$($pr.Number) marked as complete" -ForegroundColor Green
    }
}

function Validate-Merges {
    Write-Host "`n=== VALIDATION CHECKLIST ===" -ForegroundColor Cyan
    
    Write-Host "`n1️⃣ Running npm audit..." -ForegroundColor Yellow
    npm audit
    
    Write-Host "`n2️⃣ Checking for remaining Dependabot alerts..." -ForegroundColor Yellow
    Write-Host "   Visit: https://github.com/markhazleton/ReactSparkPortfolio/security/dependabot" -ForegroundColor Cyan
    
    Write-Host "`n3️⃣ Running full test suite..." -ForegroundColor Yellow
    $testResult = Test-All
    
    Write-Host "`n4️⃣ API Endpoint Tests..." -ForegroundColor Yellow
    Write-Host "   Test these endpoints manually:" -ForegroundColor Cyan
    Write-Host "   - https://Bootstrap.makeboldspark.com/api/proxy-projects" -ForegroundColor White
    Write-Host "   - https://Bootstrap.makeboldspark.com/api/proxy-joke" -ForegroundColor White
    Write-Host "   - https://Bootstrap.makeboldspark.com/api/proxy-rss" -ForegroundColor White
    
    if ($testResult) {
        Write-Host "`n✅ Validation complete - all automated tests passed!" -ForegroundColor Green
        Write-Host "⚠️  Don't forget to verify API endpoints manually" -ForegroundColor Yellow
    } else {
        Write-Host "`n❌ Validation failed - review errors above" -ForegroundColor Red
    }
}

# Main execution
switch ($Action) {
    "list" {
        Show-PRList
    }
    "test-all" {
        Test-All
    }
    "merge-critical" {
        Merge-PRGroup -PRs $CriticalPRs -Priority "CRITICAL"
    }
    "merge-medium" {
        Merge-PRGroup -PRs $MediumPRs -Priority "MEDIUM"
    }
    "merge-low" {
        Merge-PRGroup -PRs $LowPRs -Priority "LOW"
    }
    "validate" {
        Validate-Merges
    }
}

Write-Host ""
