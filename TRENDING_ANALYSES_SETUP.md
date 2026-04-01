# Real-Time Trending Economic Analyses

## Overview

The AI Economic Analyses system now automatically generates professional economic analyses based on **real-time trending topics**. This feature:

✅ Fetches trending business/finance topics from news APIs  
✅ Automatically generates institutional-quality economic analyses  
✅ Updates daily with current market trends  
✅ Supports manual topic selection or automatic trend detection  
✅ Works with scheduled cron jobs for 24/7 automation  

## Setup Instructions

### Step 1: Get NewsAPI Key (Free)

1. Visit [NewsAPI.org](https://newsapi.org)
2. Sign up for free account (up to 100 requests/day)
3. Copy your API key

### Step 2: Configure Environment Variables

Add these to your `.env.local`:

```env
# News API for trending topics (from newsapi.org)
NEWSAPI_KEY=your_newsapi_key_here

# API key for triggering trending analysis generation
TRENDING_ANALYSIS_API_KEY=your_secure_random_key

# You can also use existing keys as fallback
AI_STORY_API_KEY=your_fallback_key
```

### Step 3: Verify Configuration

Test that everything works:

```bash
# Test status endpoint
curl https://yoursite.com/api/generate-trending-analyses?status=health

# Output should show:
# {
#   "status": "ok",
#   "service": "AI Economic Analyses - Trending Generator",
#   "capabilities": [...]
# }
```

## Usage

### Option 1: Manual Trigger (One-Time)

```bash
curl -X POST \
  "https://yoursite.com/api/generate-trending-analyses?limit=5" \
  -H "Authorization: Bearer YOUR_TRENDING_ANALYSIS_API_KEY"
```

**Response:**
```json
{
  "success": true,
  "status": "completed",
  "summary": {
    "totalRequested": 5,
    "generated": 5,
    "failed": 0
  },
  "results": [
    {
      "topic": "Global Supply Chain Recovery",
      "analysisId": "...",
      "status": "success",
      "generatedAt": "2026-03-31T10:30:00Z"
    }
  ]
}
```

### Option 2: Scheduled Cron Job (Automated)

Set up automatic daily trending analysis generation:

#### Using EasyCron.com (Free)

1. Go to [easycron.com](https://www.easycron.com)
2. Click "Add New Cron Job"
3. Set cron expression: `0 8 * * *` (Daily at 8 AM UTC)
4. Paste this URL:
   ```
   https://yoursite.com/api/generate-trending-analyses?limit=5
   ```
5. Add HTTP header:
   ```
   Authorization: Bearer YOUR_TRENDING_ANALYSIS_API_KEY
   ```

#### Using Vercel Crons (Recommended for Vercel Deployment)

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

#### Using GitHub Actions

Create `.github/workflows/trending-analyses.yml`:

```yaml
name: Generate Trending Economic Analyses

on:
  schedule:
    - cron: '0 1 * * *'  # Daily at 1 AM UTC

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Generate trending analyses
        run: |
          curl -X POST \
            "${{ secrets.SITE_URL }}/api/generate-trending-analyses?limit=5" \
            -H "Authorization: Bearer ${{ secrets.TRENDING_ANALYSIS_API_KEY }}"
```

#### Using AWS Lambda + EventBridge

```bash
# Create Lambda function pointing to your API endpoint
# Set EventBridge rule: cron(0 1 * * ? *)
# Trigger: POST to /api/generate-trending-analyses
```

### Option 3: Manually Selected Topics

Generate analyses for specific topics:

```bash
curl -X POST \
  "https://yoursite.com/api/generate-trending-analyses?limit=3&topics=AI%20Markets,Green%20Energy,Crypto%20Trends" \
  -H "Authorization: Bearer YOUR_TRENDING_ANALYSIS_API_KEY"
```

## API Reference

### Endpoint: POST /api/generate-trending-analyses

**Authentication:** Bearer token (required)

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 5 | Number of trending topics to analyze (1-20) |
| `topics` | string | auto | Comma-separated specific topics (optional) |
| `api_key` | string | header | Alternative to Authorization header |

**Response (Success):**

```json
{
  "success": true,
  "status": "completed",
  "summary": {
    "totalRequested": 5,
    "generated": 5,
    "failed": 0
  },
  "results": [
    {
      "topic": "Topic Name",
      "analysisId": "document_id",
      "status": "success",
      "generatedAt": "ISO_timestamp"
    }
  ],
  "errors": [],
  "message": "Generated 5 trending economic analyses",
  "timestamp": "ISO_timestamp"
}
```

**Response (Auth Failure):**

```json
{
  "error": "Unauthorized",
  "status": 401
}
```

### Endpoint: GET /api/generate-trending-analyses?status=health

Check service health:

```bash
curl https://yoursite.com/api/generate-trending-analyses?status=health
```

## Convex Actions (Backend)

### fetchTrendingTopics

Fetch real-time trending topics from news APIs:

```typescript
// In your Convex function or action
const trending = await ctx.runAction(api.aiEconomicAnalyses.fetchTrendingTopics, {
  source: 'newsapi',  // or 'google', 'finance'
  limit: 10,
});
```

### autoGenerateTrendingAnalyses

Auto-generate economic analyses for trending topics:

```typescript
const result = await ctx.runAction(api.aiEconomicAnalyses.autoGenerateTrendingAnalyses, {
  limit: 5,
  selectedTopics: ['AI Markets', 'Energy Transition'], // optional
});
```

### getLatestTrendingAnalyses

Query the latest generated analyses:

```typescript
const analyses = await ctx.runQuery(api.aiEconomicAnalyses.getLatestTrendingAnalyses, {
  limit: 10,
});
```

## Features

### 📰 Real-Time Topic Detection
- Integrates with NewsAPI for live trending business/finance news
- Automatically extracts economic topics from headlines
- Fallback system for when APIs are unavailable

### 🤖 Institutional-Quality Analysis
- Generates 3,200-3,800 word analyses with:
  - Quantified market data and statistics
  - 6-8 stakeholder impact analysis
  - Probability-weighted scenarios
  - Professional images from Unsplash
  - Risk assessment frameworks

### 🔄 Multi-Provider Support
- Gemini 2.5-Flash integration
- OpenAI GPT-4o-mini integration
- Anthropic Claude 3 Haiku integration
- Automatic fallback if primary provider fails

### 📊 Database Integration
- Automatically saves to Convex database
- Published with full metadata
- Searchable and queryable
- Tagged for categorization

## Monitoring & Logging

### Check Generation Status

```bash
# View latest analyses
curl https://yoursite.com/api/articles  # or your articles endpoint
```

### Monitor Cron Job Execution

Via EasyCron.com dashboard: View execution logs, success/failure history, response times

Via GitHub Actions: Check workflow runs in Actions tab

Via Vercel: Check cron logs in project settings

## Troubleshooting

### Issue: "NEWSAPI_KEY not configured"

**Solution:** Add `NEWSAPI_KEY` to `.env.local` and restart dev server

```bash
# Verify env variable is loaded
echo $env:NEWSAPI_KEY  # PowerShell
echo $NEWSAPI_KEY      # Bash
```

### Issue: "Unauthorized" error

**Solution:** Verify API key matches environment variable

```bash
# Check that key is correct
echo "YOUR_KEY" | sha256sum  # Compare hashes for verification
```

### Issue: No trending topics returned

**Solution:** Check fallback topics are being used

```bash
# Enable debug logging
NEXT_PUBLIC_DEBUG_TRENDS=true npm run dev

# Check API status at newsapi.org
```

### Issue: "Failed to generate analysis"

**Solution:** Verify AI provider keys are configured

```bash
# Ensure all AI API keys are set:
# - GEMINI_API_KEY
# - OPENAI_API_KEY
# - ANTHROPIC_API_KEY
```

## Performance Tips

1. **Optimize Frequency**: Run every 6-12 hours instead of hourly to reduce API costs
2. **Batch Processing**: Set `limit=10` to generate multiple analyses in one call
3. **Cache Results**: Frontend can cache analyses for 1-2 hours
4. **Monitor Costs**: NewsAPI free tier = 100/day, track usage

## Example Integration

### Display Trending Analyses on Homepage

```tsx
// src/app/page.tsx
import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function HomePage() {
  const trending = await convex.query(api.aiEconomicAnalyses.getLatestTrendingAnalyses, {
    limit: 5,
  });

  return (
    <main>
      <section className="trending-analyses">
        <h2>📈 Trending Economic Analyses</h2>
        {trending.analyses?.map((analysis: any) => (
          <article key={analysis._id}>
            <h3>{analysis.title}</h3>
            <p>{analysis.summary}</p>
            <a href={`/article/${analysis._id}`}>Read Full Analysis →</a>
          </article>
        ))}
      </section>
    </main>
  );
}
```

## Next Steps

1. ✅ Set up NewsAPI key
2. ✅ Configure environment variables
3. ✅ Test manual trigger
4. ✅ Set up cron job for automation
5. ✅ Display trending analyses on homepage/sidebar
6. ✅ Monitor daily generation via logs
7. ✅ Optimize based on usage patterns

## Support

For issues or questions:
- Check logs: `console.log` output in terminal/dashboard
- Verify API keys: test each independently
- Enable DEBUG mode: set `NEXT_PUBLIC_DEBUG_TRENDS=true`
- Check API status pages: newsapi.org, gemini/openai/anthropic status
