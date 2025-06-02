import { NextRequest, NextResponse } from 'next/server';
import { generateReport } from '@/ai/flows/generate-reports';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { month, analysisMarkdown } = body;
  if (!month || !analysisMarkdown) {
    return NextResponse.json({ error: 'month and analysisMarkdown are required' }, { status: 400 });
  }
  try {
    const result = await generateReport({ month, analysisMarkdown });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to generate report' }, { status: 500 });
  }
}
