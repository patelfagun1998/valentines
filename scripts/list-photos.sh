#!/bin/bash
# List photos in a location folder and output as TypeScript array

LOCATION=$1

if [ -z "$LOCATION" ]; then
  echo "Usage: ./scripts/list-photos.sh <location-id>"
  echo "Example: ./scripts/list-photos.sh seattle"
  exit 1
fi

PHOTOS_DIR="public/photos/$LOCATION"

if [ ! -d "$PHOTOS_DIR" ]; then
  echo "Directory not found: $PHOTOS_DIR"
  exit 1
fi

echo "Photos in $LOCATION:"
echo ""
echo "photoFiles: ["

for file in "$PHOTOS_DIR"/*.{jpg,jpeg,png,webp,heic,JPG,JPEG,PNG,WEBP,HEIC} 2>/dev/null; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    echo "  '$filename',"
  fi
done

echo "],"
echo ""
echo "Copy the above array into WorldMap.tsx for the $LOCATION location."
