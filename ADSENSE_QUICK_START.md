# Google AdSense - Quick Setup (5 Minutes)

## ✅ What's Done
- [x] Google AdSense components created
- [x] Ad placement components ready (Header, Sidebar, Footer, Article Middle)
- [x] Environment variables configured
- [x] Homepage integrated with ads
- [x] Layout updated with AdSense script

## 🚀 Quick Setup Guide

### Step 1: Create a Google AdSense Account
1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Click "Sign up now"
3. Sign in with your Google account
4. Add your website domain (e.g., `hirwaambassadeur.com`)

### Step 2: Wait for Approval
- Google will review your site (usually 24 hours to a few days)
- Check your email for approval status

### Step 3: Get Your Publisher ID
Once approved:
1. Go to your AdSense dashboard
2. Click **Settings** → **Account**
3. Find your **Publisher ID** (looks like: `ca-pub-xxxxxxxxxxxxxxxx`)

### Step 4: Update .env.local
Edit `.env.local` and replace:
```dotenv
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx
```

Replace `ca-pub-xxxxxxxxxxxxxxxx` with your **actual Publisher ID**

### Step 5: Restart Server
```bash
npm run dev
```

## ✨ Result
- Header ad appears at the top of homepage
- Sidebar ad appears on the right side
- Ads will show within 24-48 hours after approval

## 📍 Where Ads Are Displayed

| Component | Location | File |
|-----------|----------|------|
| **HeaderAd** | Top of homepage | `src/app/page.tsx` |
| **SidebarAd** | Right sidebar on homepage | `src/app/page.tsx` |
| **ArticleMiddleAd** | Inline within articles | `src/app/article/[slug]/page.tsx` (ready to add) |
| **FooterAd** | Footer section | `src/components/layout/Footer.tsx` (ready to add) |

## 🔧 Add Ads to More Pages

### Add to Article Pages
Edit `src/app/article/[slug]/page.tsx`:
```tsx
import { ArticleMiddleAd } from '@/components/common/AdPlacements';

// Inside your article component, add after the first paragraph:
<ArticleMiddleAd />
```

### Add to Footer
Edit `src/components/layout/Footer.tsx`:
```tsx
import { FooterAd } from '@/components/common/AdPlacements';

// Add before the footer content:
<FooterAd />
```

### Add to Category Pages
Edit `src/app/categories/[slug]/page.tsx`:
```tsx
import { HeaderAd, SidebarAd } from '@/components/common/AdPlacements';

// Add at the top and in sidebar
<HeaderAd />
```

## 📊 Monitor Earnings
1. Log in to [Google AdSense Dashboard](https://www.google.com/adsense/)
2. View **Earnings** tab for:
   - Total earnings
   - Revenue by ad type
   - Performance by placement
   - Traffic metrics

## ⚠️ Important Reminders

❌ **Don't Do These:**
- ❌ Click your own ads
- ❌ Ask others to click ads
- ❌ Encourage invalid clicks
- ❌ Use multiple accounts

✅ **Do These:**
- ✅ Create quality, original content
- ✅ Drive organic traffic
- ✅ Monitor your AdSense account
- ✅ Follow Google's policies

## 🆘 Troubleshooting

**Ads not showing?**
1. Check Publisher ID is correct in `.env.local`
2. Verify account is approved in AdSense dashboard
3. Wait 24-48 hours after approval
4. Check browser console for errors

**Getting "ca-pub-xxxxxxxxxxxxxxxx" placeholder ads?**
- This is normal - it just means Publisher ID isn't set yet
- Update `.env.local` and restart server

## 📚 Full Documentation
See [GOOGLE_ADSENSE_SETUP.md](GOOGLE_ADSENSE_SETUP.md) for complete guide with all components and options.

---

**Status**: Ready for Google AdSense integration  
**Next**: Apply for Google AdSense account → Get Publisher ID → Update .env.local
