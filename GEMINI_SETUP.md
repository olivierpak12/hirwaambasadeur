# Gemini API Setup Guide - Economic Analysis

This guide explains how to set up Google's Gemini API (free tier) for generating AI-powered economic news and analysis.

## Why Gemini API?

- **Free Tier**: 60 requests per minute, unlimited usage
- **Powerful**: Gemini 1.5 Flash model is fast and cost-effective
- **Easy Integration**: Simple REST API, no heavy SDK required
- **Good for Economic Analysis**: Strong understanding of economic concepts and real-world data

## Prerequisites

- Google Account
- Node.js 18+ and Next.js project
- Convex backend properly set up

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account (create one if needed)
3. Click **"Create API Key"** 
4. Select your project (or create a new one)
5. Copy the generated API key
6. Keep it safe - it's your secret key!

## Step 2: Configure Environment Variables

Create or update your `.env.local` file:

```env
# Gemini API Configuration
GEMINI_API_KEY=your_actual_api_key_here
AI_PROVIDER=gemini

# Convex Configuration (if not already set)
NEXT_PUBLIC_CONVEX_URL=https://your-convex-project.convex.cloud

# Optional: API key for generating via HTTP (protect your endpoint)
AI_STORY_API_KEY=your_secure_api_key_for_external_calls
```

## Step 3: Verify Installation

Run your development server:

```bash
npm run dev
```

In another terminal, start Convex:

```bash
npx convex dev
```

## Step 4: Generate Your First Economic Analysis

### Option A: Via Convex Dashboard

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Navigate to your project
3. Open the "Functions" section
4. Find `aiEconomicAnalyses.generateSampleAnalysis`
5. Enter a topic, e.g., "East African Trade Growth"
6. Click Run

### Option B: Via API Endpoint

```bash
curl -X POST http://localhost:3000/api/generate-economic-analysis \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "topic": "Central Bank Interest Rate Policy"
  }'
```

### Option C: Programmatically

```typescript
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function GenerateAnalysis() {
  const generateAnalysis = useMutation(api.aiEconomicAnalyses.generateSampleAnalysis);

  const handleGenerate = async () => {
    try {
      const analysis = await generateAnalysis({ topic: 'Inflation Trends' });
      console.log('Generated:', analysis);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <button onClick={handleGenerate}>Generate Analysis</button>;
}
```

## API Models Available

The implementation uses **Gemini 1.5 Flash**:
- Cost-effective for production use
- Fast response times (< 2 seconds typically)
- Good understanding of economic analytics
- Supports JSON output formatting

## Features

### What Gets Generated

Each economic analysis includes:

- **Title**: Compelling headline
- **Summary**: 2-3 sentence overview
- **Content**: Detailed 300-500 word analysis covering:
  - Current trends and market dynamics
  - Key economic indicators
  - Risk assessment
  - Future outlook
- **Tags**: Categorization for search/filtering
- **Region**: Geographic focus (e.g., Africa, Global, Rwanda)
- **Category**: Economic sector (e.g., Trade, Inflation, Agriculture)
- **Featured Image**: Auto-selected from Unsplash

### Example Output

```json
{
  "id": "abc123...",
  "title": "Rwanda's Tech Sector Growth: Economic Impact Analysis",
  "summary": "Rwanda's digital economy is expanding rapidly with ICT contributions...",
  "content": "Detailed analysis of Rwanda's technology sector growth...",
  "tags": ["Rwanda", "Technology", "Economic Growth"],
  "region": "East Africa",
  "category": "Technology & Digital Economy",
  "metadata": {
    "model": "gemini-1.5-flash",
    "confidence": 0.82,
    "generatedAt": "2026-03-26T10:30:00Z"
  },
  "published": true,
  "createdAt": "2026-03-26T10:30:00Z"
}
```

## Database Schema

Economic analyses are stored in Convex with this structure:

```typescript
{
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  source: string;
  tags: string[];
  metadata: {
    confidence: number;
    model: string;
    generatedAt: string;
    region: string;
    category: string;
  };
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Automation Setup (Optional)

To generate economic analyses automatically every 24 hours:

### Option 1: Using a Cron Service (Recommended)

Services like [EasyCron](https://www.easycron.com/) or cloud functions:

```bash
# Cron URL (call every 24 hours)
https://your-domain.com/api/generate-economic-analysis

# Headers
Authorization: Bearer YOUR_AI_STORY_API_KEY
Content-Type: application/json

# Body
{
  "topic": "Updated: Rwanda Economic Outlook"
}
```

### Option 2: Vercel Cron Functions

Create `src/app/api/cron/generate-analysis/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Verify it's from Vercel cron
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const topics = [
    'East African Economic Growth',
    'Digital Transformation Africa',
    'Trade and Investment Trends',
    'Agricultural Sector Innovation',
  ];

  const randomTopic = topics[Math.floor(Math.random() * topics.length)];

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/generate-economic-analysis`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AI_STORY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic: randomTopic }),
    });

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
```

Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/generate-analysis",
    "schedule": "0 0 * * *"
  }]
}
```

## Troubleshooting

### "GEMINI_API_KEY not configured"

- ✓ Check `.env.local` has `GEMINI_API_KEY` set
- ✓ Restart your dev server after adding the key
- ✓ Ensure the key is valid (test at [AI Studio](https://aistudio.google.com))

### "Gemini API error: 403"

- ✓ Check API key is correct (no extra spaces)
- ✓ Ensure API is enabled in Google Cloud Project
- ✓ Check API quota hasn't been exceeded

### "Failed to parse JSON from Gemini response"

- ✓ Try with a different topic
- ✓ Check Gemini API status
- ✓ Ensure prompt is valid in AI Studio

### Slow Response Times

- ✓ Gemini 1.5 Flash is optimized for speed
- ✓ First request may take longer due to cold start
- ✓ Consider caching results to reduce API calls

## API Rate Limits

- **Free Tier**: 60 requests per minute
- **Quotas Applied At**: Per-minute rate windows
- **Recommended Usage**: 
  - Manual generation: Unlimited
  - Automated: 1 per hour or less
  - Batch: Spread out requests over time

## Security Best Practices

1. **Keep API Key Secret**
   - Never commit to Git
   - Use `.env.local` (add to `.gitignore`)
   - Rotate key if accidentally exposed

2. **Protect Your Endpoints**
   - Use `AI_STORY_API_KEY` for external calls
   - Implement rate limiting
   - Add authentication checks

3. **Validate Input**
   - Sanitize topic strings
   - Limit topic length (50-200 characters)
   - Check for malicious content

## Next Steps

1. ✅ Get API key from Google AI Studio
2. ✅ Add to `.env.local`
3. ✅ Test a manual generation
4. ✅ Set up automation (optional)
5. ✅ Configure publishing workflow

## Support & Resources

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Convex Database](https://docs.convex.dev)
- [This Project's AI Features](./README.md)

## Cost Estimation

- **Free Tier**: 60 requests/minute = unlimited for most use cases
- **Pricing** (if exceeding free tier):
  - Input: $0.075 per million tokens
  - Output: $0.30 per million tokens
  - Typical analysis: ~500 tokens = negligible cost

---

**Last Updated**: March 26, 2026
