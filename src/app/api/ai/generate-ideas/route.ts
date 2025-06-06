import { NextRequest, NextResponse } from 'next/server';
import { generatePotentialTrends } from '@/ai/flows/generate-potential-trends-flow';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }
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
import { NextRequest, NextResponse } from 'next/server';
import { generatePotentialTrends } from '@/ai/flows/generate-potential-trends-flow';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topicKeyword } = body;
    
    if (!topicKeyword || typeof topicKeyword !== 'string' || topicKeyword.trim().length < 3) {
      return NextResponse.json(
        { error: 'topicKeyword is required and must be at least 3 characters' }, 
        { status: 400 }
      );
    }

    const result = await generatePotentialTrends({ topicKeyword: topicKeyword.trim() });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error generating potential business ideas:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate business ideas' }, 
      { status: 500 }
    );
  }
}
