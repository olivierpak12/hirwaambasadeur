# Google AdSense Integration Guide

## Overview
This project now includes full Google AdSense integration with responsive ad placements across the website. Ads will automatically display once you configure your Google AdSense account.

## Setup Steps

### 1. **Create Google AdSense Account**
- Go to [Google AdSense](https://www.google.com/adsense/)
- Sign in with your Google account (use the email associated with your domain)
- Complete the application process
- Add your website domain (e.g., `www.hirwaambassadeur.com`)

### 2. **Get Your Publisher ID**
- After approval, navigate to **Settings → Account**
- Find your **Publisher ID** (format: `ca-pub-xxxxxxxxxxxxxxxx`)
- Copy this ID

### 3. **Update Environment Variables**
Open `.env.local` and update:

```dotenv
# Google AdSense Configuration
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx
```

Replace `ca-pub-xxxxxxxxxxxxxxxx` with your actual Publisher ID.

### 4. **Create Ad Units (Optional)**
For better control and reporting, create specific ad units for each placement:

1. Go to **Ads & Sites → Ad Units** in AdSense dashboard
2. Click **+ New ad unit**
3. Create units for:
   - **Header Banner** (728x90 or auto)
   - **Sidebar** (300x250 or vertical)
   - **Article Middle** (300x600 or auto)
   - **Footer** (728x90 or auto)
4. Get each unit's ID (format: `1234567890`)

### 5. **Update Unit IDs in Environment**
```dotenv
NEXT_PUBLIC_ADSENSE_HEADER_UNIT=1234567890
NEXT_PUBLIC_ADSENSE_SIDEBAR_UNIT=2345678901
NEXT_PUBLIC_ADSENSE_FOOTER_UNIT=3456789012
NEXT_PUBLIC_ADSENSE_ARTICLE_UNIT=4567890123
```

If you don't specify unit IDs, Google AdSense will auto-serve relevant ads.

## Usage in Your Pages

### Header Ad (Top of Page)
```tsx
import { HeaderAd } from '@/components/common/AdPlacements';

export default function MyPage() {
  return (
    <>
      <HeaderAd />
      {/* Page content */}
    </>
  );
}
```

### Sidebar Ad (Right Column)
```tsx
import { SidebarAd } from '@/components/common/AdPlacements';

export default function HomePage() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
      <main>{/* Main content */}</main>
      <aside>
        <SidebarAd />
      </aside>
    </div>
  );
}
```

### Article Middle Ad (Inline)
```tsx
import { ArticleMiddleAd } from '@/components/common/AdPlacements';

export default function ArticlePage() {
  return (
    <article>
      <h1>Article Title</h1>
      <p>First paragraph...</p>
      
      <ArticleMiddleAd />
      
      <p>Remaining content...</p>
    </article>
  );
}
```

### Footer Ad
```tsx
import { FooterAd } from '@/components/common/AdPlacements';

export default function Footer() {
  return (
    <footer>
      <FooterAd />
      {/* Footer content */}
    </footer>
  );
}
```

### Custom Ad (With Specific Slot)
```tsx
import GoogleAdSense from '@/components/common/GoogleAdSense';

export default function CustomAdPage() {
  return (
    <GoogleAdSense 
      slot="1234567890" 
      format="rectangle"
      style={{ margin: '20px 0' }}
    />
  );
}
```

## Components Reference

### `GoogleAdSense` Component
Base ad component with full control.

**Props:**
```typescript
interface GoogleAdSenseProps {
  slot?: string;              // Ad unit ID from AdSense dashboard
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';  // Ad format
  responsive?: boolean;       // Enable responsive ads (default: true)
  style?: React.CSSProperties;  // Custom inline styles
  className?: string;         // CSS class name
}
```

**Example:**
```tsx
<GoogleAdSense 
  slot="1234567890"
  format="vertical"
  responsive={true}
/>
```

### `HeaderAd` Component
Horizontal banner ad for page header. Responsive and styled to match site theme.

**Example:**
```tsx
<HeaderAd />
```

### `SidebarAd` Component
Vertical ad for sidebars. Standard 300x250 or vertical format.

**Example:**
```tsx
<SidebarAd />
```

### `ArticleMiddleAd` Component
Large ad for inline article placement. Styled with left border accent.

**Example:**
```tsx
<ArticleMiddleAd />
```

### `FooterAd` Component
Horizontal ad for footer sections. Full-width responsive.

**Example:**
```tsx
<FooterAd />
```

## Integration with Custom Ads System

Your project has a **custom ads management system** alongside Google AdSense:

- **Google AdSense** (Automatic): Use `GoogleAdSense` components for passive income
- **Custom Ads** (Manual): Use the admin `/admin/ads` page for promotional content and native ads

**Example - Combining Both:**
```tsx
// Show custom ads from your database
<div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
  <main>
    {/* Custom ads */}
    {customAds.map(ad => <YourCustomAdComponent key={ad._id} ad={ad} />)}
    
    {/* Google AdSense ads */}
    <ArticleMiddleAd />
  </main>
  
  <aside>
    {/* Sidebar placement for both systems */}
    <SidebarAd />
  </aside>
</div>
```

## Important Notes

### ⏰ **Ad Approval Timeline**
- Ads may take **24-48 hours** to appear after setup
- During early days, you may see blank ad spaces
- Check AdSense dashboard for any warnings or issues

### 🚫 **AdSense Policies**
- **Don't click your own ads** - This violates AdSense policies
- **Don't encourage clicks** - Never ask users to click ads
- **Ensure quality content** - Original, valuable content performs better
- **Proper disclosure** - Ads are clearly labeled as "Advertisement"

### 📊 **Monitoring Performance**
1. Log in to [Google AdSense Dashboard](https://www.google.com/adsense/)
2. View real-time metrics:
   - **Impressions** - How many times ads were shown
   - **Clicks** - User clicks on ads
   - **CTR** - Click-through rate (percentage)
   - **Earnings** - Revenue generated
3. Track per-page and placement performance

### 🔍 **Testing Ads**
During development, you can test the ad setup:

```tsx
// Use data-ad-type="test" for testing
<GoogleAdSense 
  slot="1234567890"
  style={{}}
/>
// Then check AdSense dashboard for impressions
```

### 🎨 **Styling Considerations**
All ad components are pre-styled to match your site theme:
- Dark background (#070f09)
- Gold accents (#c9a84c)
- Green highlights (#1a6a3a)
- Responsive padding and spacing

To customize ad appearance, modify `src/components/common/AdPlacements.tsx`.

## Troubleshooting

### Ads Not Showing?
1. ✅ Verify `NEXT_PUBLIC_GOOGLE_ADSENSE_ID` is set correctly
2. ✅ Check AdSense dashboard for account warnings
3. ✅ Wait 24-48 hours after approval
4. ✅ Ensure ads.txt file is in public folder (if required by AdSense)

### Blank Ad Spaces
- Normal during first 24-48 hours
- Check browser console for errors
- Verify ad unit IDs are correct

### Low Ad Revenue?
- Ensure high-quality, original content
- Use specific ad units for better targeting
- Strategic placement (header, sidebar, inline)
- Optimize page load speed
- Increase site traffic

## Next Steps

1. **Create AdSense Account** → Apply with your domain
2. **Set Publisher ID** → Update `.env.local`
3. **Create Ad Units** (Optional) → Setup specific placements
4. **Add Components** → Update your pages with ad placements
5. **Monitor Performance** → Check AdSense dashboard regularly
6. **Optimize Placements** → Test different formats and positions

## Resources

- [Google AdSense Help Center](https://support.google.com/adsense)
- [AdSense Policies](https://support.google.com/adsense/answer/48182)
- [Best Practices](https://support.google.com/adsense/answer/3394569)
- [AdSense Communities](https://support.google.com/adsense/community)

---

**Last Updated:** March 20, 2026  
**Status:** Ready for Google AdSense integration
