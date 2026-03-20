# Debugging "No Featured Image Available"

## Step 1: Check Your Browser Console

When you view an article, check the browser DevTools console (F12) for warnings like:

```
⚠️  Featured images not resolved. Article received: {
  has_featuredImage: false,
  has_featuredImages: false,
  featuredImage_value: undefined,
  ...
}
```

This tells you if the frontend is receiving the images from the backend.

---

## Step 2: Inspect Database Content

Open the Convex Dashboard and use the **Debug Query** to see exactly what's stored:

### Via Convex Dashboard:

1. Go to https://console.convex.dev
2. Select your project → **Functions**
3. Search "debugArticleData"
4. Click the function
5. In "slug" field, enter your article slug (e.g., `your-article-title`)
6. Click "Run Function"
7. Check the output to see stored image data

### Via Browser Console (if you have API access):

```javascript
// This assumes Convex is loaded
const result = await query(api.articles.debugArticleData, { slug: 'your-article-slug' });
console.log(result);
```

---

## Step 3: Check What's Stored

The debug output will show you one of these scenarios:

### ✅ Scenario A: Images ARE Stored (Storage IDs Present)

```json
{
  "featuredImageIds": ["ixxxx_yyyy"],
  "images_count": 3
}
```

**Problem**: Storage IDs exist but aren't resolving to URLs
**Solution**: Check Convex backend logs for `"Failed to get featured image URL"` errors

### ❌ Scenario B: No Image Data Stored

```json
{
  "featuredImageIds": null,
  "images_count": 0,
  "featuredImage": null
}
```

**Problem**: Images were never uploaded/saved to database
**Solution**: Re-upload images via admin panel

### ✅ Scenario C: Remote URLs Stored (Public URLs)

```json
{
  "featuredImage": "https://example.com/image.jpg"
}
```

**Problem**: Remote URLs should work, but might have CORS issues
**Solution**: Verify URL is accessible and not blocked

---

## Step 4: Verify Admin Upload Works

1. Go to http://localhost:3000/admin/create
2. Create a test article:
   - Title: "Test Article"
   - Category: Pick one
   - Content: "Test"
   - **Drag image into "Upload Featured Image" section**
   - Confirm thumbnail appears
   - Click Publish

3. Check browser console for errors during upload
4. Use debugArticleData to verify it was saved

---

## Step 5: Common Issues & Fixes

### Issue: Images uploaded but not showing

**Check**: Is Convex backend running?
```bash
# Terminal 2 - MUST be running alongside npm run dev
npx convex dev
```

If not, storage operations will fail silently.

**Fix**: Restart both:
```bash
npm run dev                    # Terminal 1
npx convex dev                # Terminal 2
```

---

### Issue: Images stored but not resolving

**Check**: Look for backend errors:
```
Failed to get featured image URL for ID: ixxxx_yyyy
```

This means the storage ID is invalid or the file was deleted.

**Fix**: Re-upload image

---

### Issue: Only gallery images show, not featured

The component falls back to gallery images if no featured images exist.

**Check**: Does your article have gallery images?
```
images_sample: [{storageId: "ixxxx", caption: "..."}]
```

**Solution**: Explicitly upload featured images (not just gallery images)

---

## Step 6: Force Refresh & Clear Cache

Sometimes browser cache causes issues:

```javascript
// In browser console on article page
localStorage.clear()
sessionStorage.clear()
window.location.reload()
```

---

## Server-Side Logs

To see what's happening on the backend:

1. Open terminal where you ran `npx convex dev`
2. Look for logs like:
   ```
   Article "My Title" has 1 storage IDs but none resolved to URLs
   Failed to get featured image URL for ID: ixxxx_yyyy
   ```

These tell you exactly which images failed to load.

---

## Need More Help?

**Collect this info and debug:**

1. Browser console output (F12)
2. debugArticleData result for your article
3. Backend terminal logs
4. Screenshot of admin upload (does thumbnail show?)
5. Article slug name

With this info, you can identify exactly where the issue is:
- Upload? (check admin)
- Storage? (check debugArticleData)
- Retrieval? (check server logs)
- Frontend? (check browser console)

