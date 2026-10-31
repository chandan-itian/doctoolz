#!/usr/bin/env bash
set -e

TOKEN="${GITHUB_TOKEN:-$1}"
if [ -z "$TOKEN" ]; then
  echo "Error: GITHUB_TOKEN environment variable or argument 1 required"
  exit 1
fi

REPO="chandan-itian/doctoolz"
TAG="v1.0.0"
APK_PATH="/home/chandan/.gemini/antigravity/scratch/doctoolz/DocToolz-v1.0.0.apk"

echo "Checking GitHub Release $TAG for $REPO..."
RELEASE_JSON=$(curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$REPO/releases" \
  -d '{
    "tag_name": "'"$TAG"'",
    "target_commitish": "main",
    "name": "DocToolz v1.0.0 (Android APK & Offline Suite)",
    "body": "## 🚀 DocToolz v1.0.0 Official Release\n\n### 📱 Android APK Highlights:\n- **Ultra-lightweight**: Only **901 KB** APK size\n- **100% Offline & Private**: Zero server uploads, works without internet\n- **All 20 Tools Included**: Passport Photo Maker, PDF Merger, Image Compressor, DPI Modifiers, OCR Extractor, QR Code Studio, etc.\n- **Direct Download**: Directly saves processed files to your device Downloads folder\n- **Hardware Accelerated**: Fast, smooth, responsive on all Android 7.0+ devices\n\n### 📥 Download:\nDownload `DocToolz-v1.0.0.apk` below and install on any Android phone.",
    "draft": false,
    "prerelease": false
  }')

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
    "https://uploads.github.com/repos/$REPO/releases/$RELEASE_ID/assets?name=DocToolz-v1.0.0.apk"
  echo ""
  echo "APK successfully published to GitHub Release!"
else
  echo "Failed to get release ID"
  exit 1
fi
