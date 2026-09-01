#!/bin/bash
set -e

echo "=== Preparing Next.js Static Export for Firebase Hosting (Spark Plan) ==="

RESTORE_API=false
RESTORE_CRM_APP=false

if [ -d "src/app/api" ]; then
  mv src/app/api src/_api_stash
  RESTORE_API=true
fi

cleanup() {
  echo "=== Restoring source tree ==="
  if [ "$RESTORE_API" = true ] && [ -d "src/_api_stash" ]; then
    mv src/_api_stash src/app/api
  fi
}

trap cleanup EXIT

echo "=== Generating Prisma Client & Building Static HTML/CSS/JS ==="
npx pnpm exec prisma generate
NEXT_EXPORT=true npx pnpm exec next build

echo "=== Deploying to Firebase Hosting ==="
firebase deploy --only hosting

echo "=== Deployment Complete! ==="
