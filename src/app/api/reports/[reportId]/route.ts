import { NextResponse } from 'next/server';
import { mockReports } from '@/lib/mock-data';

export async function GET(
  _req: Request,
  { params }: { params: { reportId: string } }
) {
  const report = mockReports.find(r => r.id === params.reportId);
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }
  return NextResponse.json({ report });
}
