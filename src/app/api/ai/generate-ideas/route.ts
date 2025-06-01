import { NextRequest, NextResponse } from 'next/server';
import { generatePotentialTrends } from '@/ai/flows/generate-potential-trends-flow';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { topicKeyword } = body;
  if (!topicKeyword || typeof topicKeyword !== 'string') {
    return NextResponse.json({ error: 'topicKeyword is required' }, { status: 400 });
  }
  try {
    const result = await generatePotentialTrends({ topicKeyword });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to generate ideas' }, { status: 500 });
  }
}
