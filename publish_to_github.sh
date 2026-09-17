#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "======================================================="
echo "  🚀 Cross-Promotion GitHub Pages 1-Click Publisher   "
echo "======================================================="

if [ -z "$(git config user.name 2>/dev/null)" ]; then
    git config user.name "ArtSphere-tech"
fi
if [ -z "$(git config user.email 2>/dev/null)" ]; then
    git config user.email "artsphere@users.noreply.github.com"
fi

if [ ! -d ".git" ]; then
    git init
    git branch -M main
fi

git add -A
git commit -m "Update CrossPromo campaigns feed and ad creatives" || echo "Already up to date."

echo ""
echo "🚀 Pushing to GitHub (main branch)..."
git push -u origin main
