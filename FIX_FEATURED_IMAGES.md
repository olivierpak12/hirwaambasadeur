# QUICK ACTION GUIDE: Fix Missing Featured Images

## 🔍 What I Did

I enhanced the debugging system so you can identify exactly where images are failing:

1. ✅ **Better console warnings** - Shows what article received from backend
2. ✅ **Backend logging** - Shows if storage ID resolution failed
3. ✅ **Debug query** - Inspect raw database data for your articles

---

## 🚀 Quick Debug (2 minutes)

### Step 1: View an Article and Check Browser Console

1. Open article in browser
2. Press **F12** (DevTools)
3. Click **Console** tab
4. Look for message like:

```
⚠️  Featured images not resolved. Article received:
{
  has_featuredImage: false,
  has_featuredImages: false,
  all_image_keys: []
}
```

**What this means:**
- `false` = Featured images NOT reached the frontend
- Could be: not uploaded, not stored, or storage failed to resolve

---

### Step 2: Check Backend Logs

1. Look at terminal running `npx convex dev`
2. Search for messages starting with:
   - `Failed to get featured image URL`
   - `Article has X storage IDs but none resolved`

**These errors show EXACTLY which step failed**

---

### Step 3: Inspect Database (Convex Dashboard)

1. Go to https://console.convex.dev
2. **Functions** → Search **"debugArticleData"**
3. Enter your article slug (from URL like `/article/my-article-title`)
4. Click **Run Function**

Check output:

**Good ✅**
```json
{
  "featuredImageIds": ["ixxxx"]  // Has storage IDs
}
```

**Bad ❌**
```json
{
  "featuredImageIds": null  // No IDs stored = upload failed
}
```

---

## 🛠️ Fixes by Scenario

### Scenario 1: Admin Upload Isn't Saving Images

1. Open http://localhost:3000/admin/create
2. Fill article
3. **Upload featured image** - Do you see thumbnail preview?

**No thumbnail?** → Upload failed
- **Fix**: Check browser console for upload errors
- Ensure `npx convex dev` is running

**Yes thumbnail?** → Check if it saved
- View article → Check console for "not resolved"
- Run debugArticleData - does it show storage IDs?

---

### Scenario 2: Images Uploaded But Not Resolving

Database has `featuredImageIds` but component gets nothing

Check `npx convex dev` terminal for:
```
Failed to get featured image URL for ID: ixxxx_yyyy
```

**Fix**: 
1. Try deleting and re-uploading the article
2. Restart Convex backend: `npx convex dev`

---

### Scenario 3: Gallery Images Show But Not Featured

Your article has gallery (multiple) but not featured (single)

**Dashboard showing?**
```
images_count: 3           // Gallery images
featuredImageIds: null    // No featured image
```

**Fix**: Explicitly upload featured image (separate from gallery)

---

## ✅ Verify It's Fixed

After you fix it, console should show:

```
(nothing warning-related) ✓
```

Article page shows image (not placeholder) ✓

---

## 📋 If Still Not Working

Collect these and you'll have complete debug info:

1. **Browser console output** (screenshot or copy-paste)
2. **Terminal logs** from `npx convex dev` (look for "Failed")
3. **debugArticleData result** for your article
4. **Your article slug** (last part of URL)

The combo of these 4 tells exactly what's wrong.

See full [DEBUG_FEATURED_IMAGES.md](./DEBUG_FEATURED_IMAGES.md) for detailed troubleshooting.
