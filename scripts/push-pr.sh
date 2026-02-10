#!/bin/bash
# Push current changes as a PR that auto-merges when CI passes
# Usage: ./scripts/push-pr.sh "commit message"

set -e

MESSAGE="${1:-Auto update}"
BRANCH="auto/$(date +%s)"

# Create a new branch from current state
git checkout -b "$BRANCH"

# Stage, commit, and push
git add -A
git commit -m "$MESSAGE"
git push origin "$BRANCH"

# Create PR with auto-merge enabled
gh pr create --title "$MESSAGE" --body "Automated PR — will auto-merge when CI passes." --base main --head "$BRANCH"
gh pr merge "$BRANCH" --auto --squash

# Switch back to main and stay up to date
git checkout main
