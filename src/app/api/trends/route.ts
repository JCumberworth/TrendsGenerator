import { NextResponse } from 'next/server';
import { mockTrends } from '@/lib/mock-data';
import { getTrendsData } from '@/lib/data-store';

export async function GET() {
  try {
    const trends = await getTrendsData();
    return NextResponse.json(trends);
  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
  }
}