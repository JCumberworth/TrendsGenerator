import { NextResponse } from 'next/server';
import { mockTrends } from '@/lib/mock-data';

export async function GET(req: Request) {
  if (req.method !== 'GET') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }
  return NextResponse.json({ trends: mockTrends });
}
