import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  try {
    console.log('API route called at:', new Date().toISOString());

    // Verify API key
    const authHeader = request.headers.get('authorization');
    const apiKey = authHeader?.replace('Bearer ', '');

    console.log('Auth header:', authHeader, 'apiKey length:', apiKey?.length);

    const expectedApiKey = process.env.AI_STORY_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey !== expectedApiKey) {
      console.log('Auth failed - expected key length:', expectedApiKey?.length);
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let jsonData;
    try {
      jsonData = await request.json();
      console.log('Parsed JSON:', jsonData);
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return Response.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    const { topic } = jsonData;
    if (!topic || typeof topic !== 'string') {
      console.log('Invalid topic:', topic);
      return Response.json(
        { error: 'Topic is required and must be a string' },
        { status: 400 }
      );
    }

    // Call Convex function to generate analysis
    console.log('About to call Convex action...');
    let analysis;
    try {
      if (Array.isArray(jsonData.trending) && jsonData.trending.length > 0) {
        analysis = await convex.action(api.aiEconomicAnalyses.generateTrendingAnalysis, {
          topic: topic.trim(),
          trending: jsonData.trending,
        });
      } else {
        analysis = await convex.action(api.aiEconomicAnalyses.generateSampleAnalysis, {
          topic: topic.trim(),
        });
      }
      console.log('Convex action completed, result:', analysis);
    } catch (convexError) {
      console.error('Convex action error:', convexError);
      const convexErrorMessage = convexError instanceof Error ? convexError.message : String(convexError);
      return Response.json(
        { error: 'Failed to generate analysis', details: convexErrorMessage },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        analysis: {
          id: analysis,
          title: `Analysis generated for ${topic}`,
        },
        message: `Economic analysis for "${topic}" generated successfully`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: 'Internal server error', details: message },
      { status: 500 }
    );
  }
}
