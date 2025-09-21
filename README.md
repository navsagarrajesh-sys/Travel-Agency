# Travel Agency Website

This repo contains a static website for a travel agency. Files include:

- `index.html` - main landing page
- `public/` - assets (CSS, JS, images)
- `views/` - header/footer partials

How to run locally:
1. Open `index.html` in a browser (it's a static site).

How to push to GitHub (manual):
1. Install Git and configure your name/email.
2. Initialize and commit if needed:
   - `git init`
   - `git add --all`
   - `git commit -m "Initial commit"`
3. Create a repository on GitHub and add the remote, then push:
   - `git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git`
   - `git push -u origin main`

If you want me to push automatically, install Git and the GitHub CLI (`gh`) and then run the provided `push-to-github.ps1` script with an execution policy bypass:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\push-to-github.ps1 -RepoName "travel-agency-website"
```

