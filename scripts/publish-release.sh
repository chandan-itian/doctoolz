#!/usr/bin/env bash
set -e

TOKEN="${GITHUB_TOKEN:-$1}"
if [ -z "$TOKEN" ]; then
  echo "Error: GITHUB_TOKEN environment variable or argument 1 required"
  exit 1
fi

REPO="chandan-itian/doctoolz"
TAG="v1.0.1"
APK_PATH="/home/chandan/.gemini/antigravity/scratch/doctoolz/DocToolz-v1.0.1.apk"

echo "Checking GitHub Release $TAG for $REPO..."
RELEASE_JSON=$(curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$REPO/releases" \
  -d '{
    "tag_name": "'"$TAG"'",
    "target_commitish": "main",
    "name": "DocToolz v1.0.1 (Pro Mobile UI & Modern Adaptive Icon)",
    "body": "## 🚀 DocToolz v1.0.1 Pro Mobile Update\n\n### 🎨 What'\''s New in v1.0.1:\n- **🌟 Premium 3D App Icon**: Completely redesigned high-definition adaptive app icon with supersampled geometry, rich Indigo-Cyan gradient, 3D document card depth, and Android 13+ Material You monochrome support.\n- **📱 Ergonomic Bottom Navigation Bar**: One-handed mobile tab bar for instant thumb-friendly access to All, Image, PDF, Exam tools, and quick tool switcher.\n- **✨ Native In-Tool Navigation**: Smooth back-to-tools navigation bar, enhanced curved tool cards, and tactile tap animations.\n- **⚡ Ultra-Compact Size**: Under **1 MB** (Only 997 KB) with 100% offline functionality.\n- **💾 Direct Android Downloads**: Saves outputs straight into your device'\''s `Downloads/DocToolz` folder.\n\n### 📥 Download:\nDownload `DocToolz-v1.0.1.apk` below and install on your Android device.",
    "draft": false,
    "prerelease": false
  }')

echo "Release response: $RELEASE_JSON"
RELEASE_ID=$(echo "$RELEASE_JSON" | grep -o '"id": [0-9]*' | head -n 1 | awk '{print $2}')

if [ -z "$RELEASE_ID" ]; then
  echo "Release may already exist, fetching release ID..."
  RELEASE_ID=$(curl -s -H "Authorization: Bearer $TOKEN" "https://api.github.com/repos/$REPO/releases/tags/$TAG" | grep -o '"id": [0-9]*' | head -n 1 | awk '{print $2}')
fi

echo "Release ID: $RELEASE_ID"

if [ -n "$RELEASE_ID" ]; then
  echo "Uploading APK asset to Release $RELEASE_ID..."
  curl -s -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/vnd.android.package-archive" \
    --data-binary @"$APK_PATH" \
    "https://uploads.github.com/repos/$REPO/releases/$RELEASE_ID/assets?name=DocToolz-v1.0.1.apk"
  echo ""
  echo "APK successfully published to GitHub Release v1.0.1!"
else
  echo "Failed to get release ID"
  exit 1
fi
