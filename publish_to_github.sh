#!/bin/bash
# Script to publish cross-promotion CDN to GitHub Pages
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "======================================================="
echo "  🚀 Cross-Promotion GitHub Pages 1-Click Publisher   "
echo "======================================================="
echo ""

if [ ! -d ".git" ]; then
    echo "📦 Initializing local Git repository..."
    git init
    git branch -M main
fi

git add -A
git commit -m "Update CrossPromo campaigns feed and ad creatives" || echo "No changes to commit."

REMOTE_URL=$(git remote get-url origin 2>/dev/null || true)

if [ -z "$REMOTE_URL" ]; then
    echo ""
    echo "Enter your GitHub Repository URL (HTTPS or SSH):"
    echo "Example: https://github.com/your-username/cross-promo-ads.git"
    read -r REPO_INPUT
    if [ -n "$REPO_INPUT" ]; then
        git remote add origin "$REPO_INPUT"
        REMOTE_URL="$REPO_INPUT"
    else
        echo "❌ Error: Repository URL cannot be empty."
        exit 1
    fi
fi

echo "🚀 Pushing to GitHub (main branch)..."
git push -u origin main

echo ""
echo "======================================================="
echo "  ✅ SUCCESS! Files pushed to GitHub.                 "
echo "======================================================="
echo ""
echo "Now enable GitHub Pages in 2 clicks:"
echo "1. Go to your repo on GitHub: $REMOTE_URL"
echo "2. Click 'Settings' -> 'Pages' (in left sidebar)"
echo "3. Under 'Build and deployment' -> 'Branch', select 'main' -> '/ (root)' -> click 'Save'"
echo ""
echo "Your live 24/7 cross-promotion URL will be:"
echo "https://<your-username>.github.io/<repo-name>"
echo "======================================================="
