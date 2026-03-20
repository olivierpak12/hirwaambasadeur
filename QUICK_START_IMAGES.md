# Quick Start: Adding Featured Images

## TL;DR

**The "No featured images found" warning is normal.**  
Your UI already handles missing images with placeholders. The warning has been removed.

---

## Add Sample Articles With Images (Right Now)

### Via Convex CLI (Easiest)

```bash
# Make sure you have both running
npm run dev              # Terminal 1
npx convex dev          # Terminal 2

# Then in Terminal 3:
npx convex run articles:seedDemoArticles
```

✅ This creates 3 beautiful sample articles with featured images from Unsplash.

---

### Via Convex Dashboard

1. Go to https://console.convex.dev
2. Select your project
3. Click **Functions** → Search "seedDemoArticles"
4. Click the function → **Run Function**
5. Refresh http://localhost:3000

---

## Upload Real Images

1. Visit http://localhost:3000/admin/create
2. Fill in article details
3. Drag-and-drop images into the **"Upload Featured Image"** section
4. Fill remaining fields
5. Click **Publish**

Done! Your article now has featured images stored in Convex.

---

## What Was Fixed

| Issue | Fix |
|-------|-----|
| Console warning about missing images | ✅ Removed unnecessary debug log |
| No way to add sample data | ✅ Created `seedDemoArticles()` function |
| Unclear how images work | ✅ Added comprehensive guide |

---

## Everything Still Working?

- Homepage shows articles with placeholders ✅
- Admin dashboard handles image uploads ✅
- Article pages display images correctly ✅
- Featured articles grid uses fallback gradients ✅

All good! Your featured images system is working as designed.

---

**See [FEATURED_IMAGES_GUIDE.md](./FEATURED_IMAGES_GUIDE.md) for full documentation.**
