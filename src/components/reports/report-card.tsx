import type { Report } from '@/types';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CalendarDays, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  // Extract a short snippet from markdown for description
  const snippet = report.report_markdown.split('\n').slice(2, 5).join(' ').substring(0, 100) + '...';

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center mb-2">
          <FileText className="h-6 w-6 mr-3 text-primary" />
          <CardTitle className="font-headline text-xl">Monthly Report: {report.month}</CardTitle>
        </div>
        <CardDescription className="text-sm line-clamp-3">
          {snippet}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Potentially add more summary info here if available */}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground flex items-center">
          <CalendarDays className="h-3 w-3 mr-1" />
          Generated: {format(parseISO(report.generated_at), 'MMM d, yyyy')}
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/reports/${report.id}`}>
            View Report <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
