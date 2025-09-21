<#
Usage:
  Open PowerShell in the project folder and run:
    ./push-to-github.ps1 -RepoName "my-repo-name"
  If you omit -RepoName it will use the folder name.

What it does:
  - Checks for git and gh (GitHub CLI).
  - If git missing, it prints instructions to install Git.
  - If gh is available, it will create a GitHub repo and push in one step.
  - Otherwise it will initialize a local repo, commit, and print exact commands to create a remote and push.
#>
param(
    [string]$RepoName = (Split-Path -Leaf (Get-Location))
)

function Test-CommandExists {
    param([string]$cmd)
    try {
        & $cmd --version *> $null
        return $true
    } catch {
        return $false
    }
}

Write-Host "Project path: $(Get-Location)"
Write-Host "Desired GitHub repo name: $RepoName"

if (-not (Test-CommandExists -cmd 'git')) {
    Write-Host "\nERROR: 'git' is not installed or not on PATH. Install Git for Windows and re-run this script."
    Write-Host "Download: https://git-scm.com/"
    exit 1
}

$hasGh = Test-CommandExists -cmd 'gh'

if ($hasGh) {
    Write-Host "\n'gh' detected — attempting to create repository on GitHub and push..."
    # Use gh to create and push; this will prompt for auth if needed.
    gh repo create $RepoName --public --source=. --remote=origin --push --confirm
    if ($LASTEXITCODE -eq 0) {
        Write-Host "\nSuccess: repository created and pushed using gh."
        exit 0
    } else {
        Write-Host "\n'gh' command failed with exit code $LASTEXITCODE. Falling back to manual instructions."
    }
}

# Fallback: initialize local repo and show push commands
Write-Host "\nInitializing local git repository and creating initial commit..."
if (-not (Test-Path -Path .git)) {
    git init
} else {
    Write-Host "Repository already has a .git folder. Skipping 'git init'."
}

# Ensure branch name is main
try { git branch -M main } catch {}

# Stage and commit
git add --all

# Only commit if there are staged changes
$changes = git status --porcelain
if ($changes) {
    git commit -m "Initial commit"
    Write-Host "Committed local changes."
} else {
    Write-Host "No changes to commit."
}

Write-Host "\nNext steps (manual - pick one):\n"
Write-Host "1) Create the GitHub repository using the website, then add remote and push:" -ForegroundColor Yellow
Write-Host "   - Create repo named: $RepoName on https://github.com/new" -ForegroundColor Gray
Write-Host "   - Then run (replace USERNAME):" -ForegroundColor Gray
Write-Host "       git remote add origin https://github.com/USERNAME/$RepoName.git" -ForegroundColor Gray
Write-Host "       git push -u origin main" -ForegroundColor Gray

Write-Host "\n2) If you can install GitHub CLI (gh), run this locally to create+push in one step:" -ForegroundColor Yellow
Write-Host "   - Install: https://cli.github.com/" -ForegroundColor Gray
Write-Host "   - Then run:" -ForegroundColor Gray
Write-Host "       gh auth login" -ForegroundColor Gray
Write-Host "       gh repo create $RepoName --public --source=. --remote=origin --push --confirm" -ForegroundColor Gray

Write-Host "\nIf you want, paste the output here or grant me access to run these commands and I can continue."

exit 0
