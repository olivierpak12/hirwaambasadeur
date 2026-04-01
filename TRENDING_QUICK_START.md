# Trending Economic Analyses - Quick Reference

## 🚀 Quick Start (5 Minutes)

### Step 1: Get API Key
```
1. Visit newsapi.org
2. Sign up (free)
3. Copy API key
```

### Step 2: Add to .env.local
```env
NEWSAPI_KEY=your_key
TRENDING_ANALYSIS_API_KEY=random_secure_key
```

### Step 3: Generate Trending Analyses
```bash
curl -X POST \
  "https://yoursite.com/api/generate-trending-analyses?limit=5" \
  -H "Authorization: Bearer YOUR_TRENDING_ANALYSIS_API_KEY"
```

✅ Done! Analyses are now being generated from real-time trends.

---

## 📋 Common Commands

### Generate 5 Trending Analyses
```bash
curl -X POST \
  "https://yoursite.com/api/generate-trending-analyses?limit=5" \
  -H "Authorization: Bearer $TRENDING_ANALYSIS_API_KEY"
```

### Generate for Specific Topics
```bash
curl -X POST \
  "https://yoursite.com/api/generate-trending-analyses?limit=3&topics=AI,Energy,Trade" \
  -H "Authorization: Bearer $TRENDING_ANALYSIS_API_KEY"
```

### Check Health Status
```bash
curl "https://yoursite.com/api/generate-trending-analyses?status=health"
```

### Get Latest Trending Analyses
```typescript
const analyses = await convex.query(api.aiEconomicAnalyses.getLatestTrendingAnalyses, {
  limit: 10,
});
```

---

## ⏰ Schedule Automation (Choose One)

### Option A: EasyCron.com (Easiest)
1. Go to easycron.com
2. Add cron job: `https://yoursite.com/api/generate-trending-analyses?limit=5`
3. Add header: `Authorization: Bearer YOUR_KEY`
4. Schedule: Daily 8 AM

### Option B: GitHub Actions
Create `.github/workflows/trending.yml`:
```yaml
on:
  schedule:
    - cron: '0 1 * * *'
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - run: curl -X POST "${{ secrets.SITE_URL }}/api/generate-trending-analyses?limit=5" \
              -H "Authorization: Bearer ${{ secrets.TRENDING_ANALYSIS_API_KEY }}"
```

### Option C: Vercel Crons
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/generate-trending-analyses?limit=5",
      "schedule": "0 1 * * *"
    }
  ]
}
```

---

## 📊 What Gets Generated

Each trending analysis includes:

✅ **Professional Title** (specific to trending topic)  
✅ **3,200-3,800 Word Analysis**  
✅ **5 Research Sections:**
- Historical Context (600-750 words)
- Current Market Analysis (600-750 words)
- Stakeholder Impact (600-750 words)
- Risk Assessment (450-550 words)
- Future Scenarios (600-700 words)

✅ **Quantified Data:**
- Specific numbers, percentages, market figures
- 6-8 distinct stakeholder groups with quantified impacts
- Probability-weighted scenarios (Optimistic 28%, Base 52%, Downside 20%)

✅ **6 Professional Images** from Unsplash with captions

✅ **Conclusion** (200-250 words)

✅ **Tags & Categorization**

---

## 🔍 Troubleshooting

| Problem | Solution |
|---------|----------|
| 401 Unauthorized | Check `TRENDING_ANALYSIS_API_KEY` matches |
| No topics returned | Verify `NEWSAPI_KEY` is valid at newsapi.org |
| Generation fails | Check all AI keys (GEMINI, OPENAI, ANTHROPIC) |
| Analyses not in DB | Verify Convex is running (`npx convex dev`) |
| Cron not executing | Check cron service logs (EasyCron/GitHub/Vercel) |

---

## 💡 Pro Tips

1. **Start Small**: Test with `limit=1` first
2. **Monitor Costs**: NewsAPI free = 100 requests/day
3. **Optimal Frequency**: Run every 6-12 hours, not hourly
4. **Error Emails**: Get notifications when generation fails
5. **Test Topics**: Use specific topics like `"AI Investment"` instead of generic `"AI"`

---

## 📱 Display on Homepage

```tsx
// Show trending analyses on your homepage sidebar
<section className="trending">
  <h3>📈 Trending Analyses</h3>
  {trendingAnalyses?.map(analysis => (
    <div key={analysis._id}>
      <h4>{analysis.title}</h4>
      <p>{analysis.summary}</p>
      <a href={`/article/${analysis._id}`}>Read →</a>
    </div>
  ))}
</section>
```

---

## 🎯 Next Actions

- [ ] Get NewsAPI key from newsapi.org
- [ ] Add environment variables to `.env.local`
- [ ] Test manual API call
- [ ] Set up cron job for daily automation
- [ ] Display trending analyses on homepage
- [ ] Monitor first run via logs
- [ ] Enable health monitoring

---

## 📞 Support

API Status: `GET /api/generate-trending-analyses?status=health`

For detailed setup: See `TRENDING_ANALYSES_SETUP.md`

For API docs: Check inline comments in `convex/aiEconomicAnalyses.ts`
