# Featured Images Setup Guide

## Problem: "No featured images found" Warning

This document explains the featured images architecture and how to populate your articles with images.

---

## Architecture Overview

Your project uses **Convex Storage** for image management:

```
User uploads image → Stored in Convex Storage → Storage ID stored in DB
ArticleDisplay → enrichArticle() → Converts storage ID → Signed URL → Displays in UI
```

**Storage IDs** are permanent identifiers that never expire, unlike signed URLs which are temporary.

---

## Why Articles Don't Have Images

Articles created **without** featured images won't display images. This is expected behavior, not a bug.

- The UI already has **fallback placeholders** (gradient backgrounds)
- Components gracefully handle missing images
- The debug console log has been removed

---

## How to Add Featured Images

### **Option 1: Use the Admin Dashboard (Recommended)**

1. Go to http://localhost:3000/admin/create
2. Fill in article details
3. Click **"Upload Featured Image"** section
4. Upload image files (automatically stored in Convex Storage)
5. Upload gallery images (optional)
6. Publish article

The dashboard handles all storage ID management automatically.

---

### **Option 2: Use Seed Demo Articles (Dev Testing)**

To quickly create 3 sample articles with beautiful public images for testing:

#### From Browser Console:

```javascript
// Open browser DevTools (F12) → Console tab
await import('convex/react').then(m => m.useAction)(/* seed function */)

// OR use the Convex Dashboard directly
```

#### From Convex Dashboard:

1. Go to [Convex Dashboard](https://console.convex.dev)
2. Select your project
3. Navigate to **Functions** tab
4. Find `articles.seedDemoArticles`
5. Click "Run Function"
6. Confirm - it creates 3 demo articles with featured images

#### From Terminal (One-time Setup):

```bash
npm run dev
# In another terminal:
npx convex run articles:seedDemoArticles
```

The seed function:
- Creates demo categories and author
- Adds 3 articles with Unsplash public image URLs
- Sets random view counts
- Only runs if database is empty (safe)

---

## How Featured Images Are Resolved

### For Articles Created in Admin:

```
Image Upload → Convex Storage → Storage ID saved → enrichArticle() → Signed URL
↓
ArticleDisplay receives featuredImages: ["https://storage.convex.cloud/..."]
```

### For Seed Articles:

```
Public Image URL → Stored directly in DB → enrichArticle() detects URL → Returns as-is
↓
ArticleDisplay receives featuredImage: "https://images.unsplash.com/..."
```

Both methods work seamlessly!

---

## Troubleshooting

### Articles still show no images after creating?

**Check these:**

1. **Images actually uploaded in admin?**
   - Go back to your article
   - Verify the upload section shows thumbnails

2. **Storage IDs are valid?**
   - Open browser DevTools → Network tab
   - Look for image requests
   - Check if 403 Forbidden or successful (200)

3. **Convex backend running?**
   ```bash
   npm run dev        # Terminal 1: Next.js
   npx convex dev     # Terminal 2: Convex backend
   ```

### Demo seed isn't working?

Make sure:
- Database is completely empty (no existing articles)
- Convex backend is running (`npx convex dev`)
- You have valid Convex project setup

---

## Image Requirements

### Supported Formats
- JPEG, PNG, WebP, GIF

### Recommendations
- **Featured images**: 800x500px minimum (16:9 aspect ratio)
- **Gallery images**: Square (1:1) or any size (scaled to fit)
- **File size**: Keep under 2MB per image
- **Quality**: High resolution preferred (1600x900+ for featured)

---

## For Production Deployment

### Before going live:

1. **Upload real featured images** via admin dashboard
2. **Remove test articles** created by seedDemoArticles (if used)
3. **Test image loading** on live domain
4. **Monitor storage usage** in Convex Dashboard

### Best Practices:

- Always provide featured images for published articles
- Use descriptive captions for gallery images
- Keep images optimized (compress before upload)
- Archive instead of delete articles (preserves history)

---

## Technical Details

### Database Schema
```
articles {
  featuredImageIds?: string[]     // Array of Convex storage IDs
  featuredImageId?: string        // Legacy single image ID
  featuredImage?: string          // Direct URL (for seed/legacy data)
  images?: Array<{
    storageId: string             // Storage ID for gallery images
    caption?: string              // Optional caption
  }>
}
```

### Key Functions

**enrichArticle()** - Converts storage IDs to signed URLs
- Location: `convex/articles.ts`
- Called on every article query
- Automatically resolves all image types

**seedDemoArticles()** - Creates sample articles (dev only)
- Location: `convex/articles.ts`
- Safe to run multiple times (checks existing data)
- Uses public Unsplash images (no storage needed)

---

## Need Help?

1. **Admin upload not working?**
   - Check ImageUpload component: `src/components/common/ImageUpload.tsx`
   
2. **Images not showing?**
   - Check enrichArticle() function in `convex/articles.ts`
   - Review ArticleDisplay component: `src/components/article/ArticleDisplay.tsx`

3. **Need to reset database?**
   - Go to Convex Dashboard → Database
   - Click "Clear database" (caution: irreversible)

