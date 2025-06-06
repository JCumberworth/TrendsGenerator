import { NextRequest, NextResponse } from 'next/server';
import { analyzePotentialTrend } from '@/ai/flows/analyze-potential-trend-flow';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trendName } = body;

    if (!trendName || typeof trendName !== 'string') {
      return NextResponse.json(
        { error: 'trendName is required' }, 
        { status: 400 }
      );
    }

    const result = await analyzePotentialTrend({ trendName: trendName.trim() });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error analyzing potential trend:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze potential trend' }, 
      { status: 500 }
    );
  }
}