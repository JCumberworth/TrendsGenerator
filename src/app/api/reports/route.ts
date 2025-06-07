import { NextResponse } from 'next/server';
import { getReportsData } from '@/lib/data-store';

export async function GET() {
  try {
    const reports = await getReportsData();
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}