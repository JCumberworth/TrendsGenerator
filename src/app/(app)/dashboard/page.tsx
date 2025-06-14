import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { Trend, Report } from '@/types';
import { getTrendsData, getReportsData } from '@/lib/data-store';

import { TrendCard } from '@/components/trends/trend-card';
import { ReportCard } from '@/components/reports/report-card';
import { ChevronRight } from 'lucide-react';

async function getData() {
  // Get fresh data from daily updates, fallback to mock data if needed
  const trendsData = await getTrendsData();
  const reportsData = await getReportsData();
  return { trendsData, reportsData };
}

export default async function DashboardPage() {
  const { trendsData, reportsData } = await getData();
  
  // Ensure we have arrays to work with
  const trendsArray = Array.isArray(trendsData) ? trendsData : [];
  const reportsArray = Array.isArray(reportsData) ? reportsData : [];
  
  const latestTrends = trendsArray.slice(0, 3);
  const recentReports = reportsArray.slice(0, 2);

  return (
    <div className="container mx-auto space-y-6">
      <h1 className="font-headline text-3xl font-bold mt-4 mb-8 text-foreground">Business Dashboard</h1>
      <p className="text-muted-foreground mb-10 -mt-6 max-w-2xl">Welcome! Get quick insights into key business trends and actionable monthly reports.</p>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline text-2xl font-semibold text-foreground">Key Business Trends</h2>
          <Button variant="outline" asChild>
            <Link href="/trends">View All Trends <ChevronRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        {latestTrends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestTrends.map((trend) => (
              <TrendCard key={trend.id} trend={trend} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No key trends available yet.</p>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline text-2xl font-semibold text-foreground">Recent Trend Reports</h2>
          <Button variant="outline" asChild>
            <Link href="/reports">View All Reports <ChevronRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        {recentReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No reports available yet.</p>
        )}
      </section>
    </div>
  );
}