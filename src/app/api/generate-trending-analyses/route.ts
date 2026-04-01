import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * API Endpoint: POST /api/generate-trending-analyses
 * 
 * Automatically fetches real-time trending topics and generates economic analyses
 * 
 * Query Parameters:
 * - limit: number of trending topics to analyze (default: 5)
 * - api_key: authentication key (must match TRENDING_ANALYSIS_API_KEY env var)
 * 
 * Example cron job (24-hour schedule):
 * curl -X POST "https://yoursite.com/api/generate-trending-analyses?limit=5" \
 *   -H "Authorization: Bearer YOUR_API_KEY"
 */
export async function POST(request: Request) {
  try {
    console.log('[Trending] Analysis generation started at:', new Date().toISOString());

    // Extract URL parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '5');
    const selectedTopics = url.searchParams.get('topics')
      ? url.searchParams.get('topics')!.split(',').map(t => t.trim())
      : undefined;

    // Verify API authentication
    const authHeader = request.headers.get('authorization');
    const apiKey = authHeader?.replace('Bearer ', '');

    if (!apiKey) {
      console.log('[Trending] Missing authorization header');
      return Response.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      );
    }

    // Check API key against environment variable
    const expectedApiKey = process.env.TRENDING_ANALYSIS_API_KEY ||
                          process.env.AI_STORY_API_KEY ||
                          process.env.GEMINI_API_KEY;

    if (apiKey !== expectedApiKey) {
      console.log('[Trending] Unauthorized API key');
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate limit parameter
    if (isNaN(limit) || limit < 1 || limit > 20) {
      return Response.json(
        { error: 'Limit must be between 1 and 20' },
        { status: 400 }
      );
    }

    console.log(`[Trending] Generating analyses for ${limit} topics...`);

    // Call Convex action to auto-generate trending analyses
    let result;
    try {
      result = await convex.action(api.aiEconomicAnalyses.autoGenerateTrendingAnalyses, {
        limit,
        selectedTopics,
      });

      console.log('[Trending] Generation completed:', result);
    } catch (convexError: any) {
      console.error('[Trending] Convex action error:', convexError);
      return Response.json(
        {
          success: false,
          error: 'Failed to generate trending analyses',
          details: convexError.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Return success response
    return Response.json(
      {
        success: result.success,
        status: result.success ? 'completed' : 'failed',
        summary: {
          totalRequested: result.totalRequested,
          generated: result.generated,
          failed: result.failed,
        },
        results: result.results,
        errors: result.errors || [],
        message: `Generated ${result.generated} trending economic analyses`,
        timestamp: new Date().toISOString(),
      },
      {
        status: result.success ? 200 : 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      }
    );
  } catch (error: any) {
    console.error('[Trending] Unexpected error:', error);
    return Response.json(
      {
        success: false,
        error: 'Internal server error',
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler for status checks and health monitoring
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  
  if (url.searchParams.get('status') === 'health') {
    return Response.json({
      status: 'ok',
      service: 'AI Economic Analyses - Trending Generator',
      timestamp: new Date().toISOString(),
      capabilities: [
        'Real-time trending topic detection',
        'Automatic economic analysis generation',
        'Multi-source trend aggregation',
        'Scheduled cron job support',
      ],
    });
  }

  return Response.json(
    {
      error: 'Method not supported',
      usage: 'POST /api/generate-trending-analyses?limit=5',
      example: 'curl -X POST https://yoursite.com/api/generate-trending-analyses?limit=5 -H "Authorization: Bearer YOUR_API_KEY"',
    },
    { status: 405 }
  );
}
