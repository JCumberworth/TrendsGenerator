import { NextRequest, NextResponse } from 'next/server';
import { analyzeTrends } from '@/ai/flows/analyze-trends';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }
  const body = await req.json();
  const { trendData } = body;
  if (!trendData || typeof trendData !== 'string') {
    return NextResponse.json({ error: 'trendData is required' }, { status: 400 });
  }
  try {
    const result = await analyzeTrends({ trendData });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to analyze trends' }, { status: 500 });
  }
}
