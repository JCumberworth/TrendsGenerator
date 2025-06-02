import { NextResponse } from 'next/server';
import { mockReports } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ reports: mockReports });
}
