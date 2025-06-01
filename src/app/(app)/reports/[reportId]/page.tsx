import type { Report } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CalendarDays } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// In a real app, fetch the report by ID
async function getReport(reportId: string): Promise<Report | undefined> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/reports/${reportId}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    return undefined;
  }
  const data = await res.json();
  return data.report as Report;
}

export default async function ReportDetailsPage({ params }: { params: { reportId: string } }) {
  const report = await getReport(params.reportId);

  if (!report) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="font-headline text-2xl font-bold mb-4">Report Not Found</h1>
        <p className="text-muted-foreground mb-4">The report you are looking for does not exist.</p>
        <Button asChild variant="outline">
          <Link href="/reports">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/reports">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Reports
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center mb-2">
            <FileText className="h-8 w-8 mr-3 text-primary" />
            <CardTitle className="font-headline text-3xl">
              Monthly Report: {report.month}
            </CardTitle>
          </div>
          <div className="text-sm text-muted-foreground flex items-center">
            <CalendarDays className="h-4 w-4 mr-1" />
            Generated: {format(parseISO(report.generated_at), 'MMMM d, yyyy, HH:mm')}
          </div>
        </CardHeader>
        <CardContent>
          {/* Basic Markdown rendering using a pre tag. For rich HTML, use react-markdown or similar */}
          <div className="prose dark:prose-invert max-w-none bg-card p-4 rounded-md border">
             <pre className="whitespace-pre-wrap break-words font-body text-sm">
               {report.report_markdown}
             </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Optional: Generate static paths if you know all report IDs at build time
// export async function generateStaticParams() {
//   return mockReports.map((report) => ({
//     reportId: report.id,
//   }));
// }
