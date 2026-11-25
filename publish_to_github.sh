#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"
git remote get-url origin >/dev/null
if [[ "$(git branch --show-current)" != "main" ]]; then
    echo "Switch to main before publishing." >&2
    exit 1
fi

git fetch origin main
if ! git merge-base --is-ancestor origin/main HEAD; then
    echo "Local main is behind GitHub. Synchronize before publishing." >&2
    exit 1
fi

if ! git diff --cached --quiet; then
    echo "Unstage existing changes before using this publisher." >&2
    exit 1
fi

python3 validate_campaigns.py
git add -- campaigns.json creatives/
if ! git diff --cached --quiet; then
    git commit -m "Update cross-promotion campaigns and creatives"
fi
git push origin HEAD:main
