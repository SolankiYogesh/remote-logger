#!/bin/bash

# Exit on error
set -e

# Check if version argument is provided
if [ -z "$1" ]; then
  echo "Usage: ./release.sh <patch|minor|major>"
  exit 1
fi

VERSION_TYPE=$1

echo "🚀 Starting release process for $VERSION_TYPE version..."

# Ensure we are in the packages/logger directory
if [[ ! "$PWD" == */packages/logger ]]; then
  echo "❌ Please run this script from the packages/logger directory"
  exit 1
fi

# 1. Clean and Build
echo "📦 Building package..."
npm run build

# 2. Bump Version & Create Git Tag
echo "🔖 Bumping version..."
npm version $VERSION_TYPE

# 3. Push to Git (Tags included)
echo "⬆️ Pushing changes and tags to Git..."
git push --follow-tags

# 4. Publish to NPM
echo "🚀 Publishing to NPM..."
npm publish

echo "✅ Release complete!"
