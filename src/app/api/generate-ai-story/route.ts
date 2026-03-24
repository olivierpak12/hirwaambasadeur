import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    // Simple authentication - in production, use proper API key validation
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.AI_STORY_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate new AI story
    const storyId = await convex.mutation(api.aiStories.generateNewStory);

    return NextResponse.json({
      success: true,
      storyId,
      message: 'New AI story generated successfully'
    });
  } catch (error) {
    console.error('Error generating AI story:', error);
    return NextResponse.json({
      error: 'Failed to generate story',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}