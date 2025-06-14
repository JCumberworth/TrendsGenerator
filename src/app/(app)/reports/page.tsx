import { ReportCard } from '@/components/reports/report-card';
import type { Report } from '@/types';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getReportsData } from '@/lib/data-store';

async function getReports(): Promise<Report[]> {
  return getReportsData();
}

export default async function ReportsPage() {
  const reports = await getReports();

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="font-headline text-3xl font-bold text-foreground">Monthly Trend Reports</h1>
        <div className="relative w-full sm:w-auto sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reports by month..."
            className="w-full rounded-lg bg-background pl-8"
            // onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>
       <p className="text-muted-foreground mb-8 -mt-4 max-w-2xl">
        Concise, actionable snapshots of key business trends to help you make informed decisions.
      </p>

      {reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
         <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No reports found.</p>
          <p className="mt-2 text-sm text-muted-foreground">Check back later for new monthly trend reports.</p>
        </div>
      )}
    </div>
  );
}