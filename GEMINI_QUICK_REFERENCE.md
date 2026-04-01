# Gemini API - Quick Reference

## Setup (3 steps, 2 minutes)

1. **Get API Key**
   ```
   → Go to aistudio.google.com/apikey
   → Click "Create API Key"
   → Copy your key
   ```

2. **Set Environment Variable**
   ```env
   GEMINI_API_KEY=your_key_here
   AI_PROVIDER=gemini
   ```

3. **Done!** Your app now uses Gemini for economic analysis

## Test It

### Via Browser
```
POST /api/generate-economic-analysis
Header: Authorization: Bearer YOUR_API_KEY
Body: {"topic": "Rwanda Economic Growth"}
```

### Via CLI
```bash
curl -X POST http://localhost:3000/api/generate-economic-analysis \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"topic": "Trade Trends Africa"}'
```

### Via Convex Dashboard
```
Dashboard → Functions → generateSampleAnalysis
Topic: "Inflation Analysis"
Run
```

## What It Generates

Each analysis = Title + Summary + 300-500 word detailed content + Tags + Region + Category

## Common Topics to Try

- "East African Coffee Export Growth"
- "Rwanda Technology Sector Development"
- "East African Trade Partnership"
- "Digital Currency Adoption Africa"
- "Agricultural Innovation Rwanda"
- "Central Bank Monetary Policy"
- "Tech Startup Ecosystem Nairobi"
- "Supply Chain Resilience Africa"

## Environment Variables Reference

```env
# Required
GEMINI_API_KEY=xxx
AI_PROVIDER=gemini
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# Optional (for API endpoint protection)
AI_STORY_API_KEY=your_secure_key
```

## API Endpoint

- **URL**: `POST /api/generate-economic-analysis`
- **Auth**: `Authorization: Bearer YOUR_API_KEY`
- **Rate Limit**: 60 requests/minute (free)
- **Response**: JSON with generated analysis object

## Pricing

**Free** ✓ - 60 requests/minute, enough for:
- Daily automated generation (24/7)
- Manual testing
- Batch operations (spread over time)

## Model Used

**Gemini 1.5 Flash**
- Fast (< 2 seconds)
- Cost-effective
- Excellent for economic analysis
- JSON output support

## Troubleshooting Quick Fixes

| Problem | Fix |
|---------|-----|
| "API Key not configured" | Restart dev server after adding `.env.local` |
| "403 Error" | Verify key is correct, check quota on aistudio.google.com |
| "No content generated" | Try different topic wording |
| Slow responses | First request is slower, subsequent are faster |

## File Changes Made

- `convex/aiEconomicAnalyses.ts` - Added Gemini support
- `src/app/api/generate-economic-analysis/route.ts` - New API endpoint
- `.env.local` - Add GEMINI_API_KEY

## Next: Automation (Optional)

Want automatic daily generation? See GEMINI_SETUP.md for cron setup.

---
**Quick Links**:
- [Get API Key](https://aistudio.google.com/apikey)
- [Gemini Docs](https://ai.google.dev/docs)
- [Full Setup Guide](./GEMINI_SETUP.md)
