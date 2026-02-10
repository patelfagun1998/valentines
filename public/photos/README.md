# Photos Directory

## How to Add Photos

1. **Download photos from Google Photos**
   - Open the shared album link
   - Select all photos (Cmd+A)
   - Click three dots menu → Download

2. **Place photos in location folders**
   ```
   public/photos/
   ├── seattle/
   │   ├── IMG_001.jpg
   │   ├── IMG_002.jpg
   │   └── ...
   ├── paris/
   │   └── ...
   └── [location-id]/
       └── ...
   ```

3. **Update WorldMap.tsx** with filenames
   ```tsx
   {
     id: 'seattle',
     name: 'Seattle',
     photoFiles: ['IMG_001.jpg', 'IMG_002.jpg', ...],
   }
   ```

4. **Commit and push** - photos will be included in deploy

## Supported Formats
- .jpg, .jpeg, .png, .webp, .heic

## Google Photos Links
| Location | Link |
|----------|------|
| Seattle | https://photos.app.goo.gl/7P6z2JjEF24G5NN58 |
