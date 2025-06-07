
import { NextRequest, NextResponse } from 'next/server';
import { generateProjectOutline } from '@/ai/flows/generate-project-outline-flow';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trendName, analysisMarkdown } = body;

    if (!trendName || typeof trendName !== 'string') {
      return NextResponse.json(
        { error: 'trendName is required' }, 
        { status: 400 }
      );
    }

    if (!analysisMarkdown || typeof analysisMarkdown !== 'string') {
      return NextResponse.json(
        { error: 'analysisMarkdown is required' }, 
        { status: 400 }
      );
    }

    const result = await generateProjectOutline({ 
      trendName: trendName.trim(),
      analysisMarkdown: analysisMarkdown.trim()
    });
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error generating project outline:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate project outline' }, 
      { status: 500 }
    );
  }
}
