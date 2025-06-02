import { NextRequest, NextResponse } from 'next/server';
import { analyzePotentialTrend } from '@/ai/flows/analyze-potential-trend-flow';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { trendName } = body;
  if (!trendName || typeof trendName !== 'string') {
    return NextResponse.json({ error: 'trendName is required' }, { status: 400 });
  }
  try {
    const result = await analyzePotentialTrend({ trendName });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to analyze idea' }, { status: 500 });
  }
}
