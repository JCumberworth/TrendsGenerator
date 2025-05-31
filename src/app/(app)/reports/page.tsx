import { ReportCard } from '@/components/reports/report-card';
import { mockReports } from '@/lib/mock-data';
import type { Report } from '@/types';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// In a real app, this would be a server component fetching data
export default function ReportsPage() {
  const reports: Report[] = mockReports; // Fetch or get reports here

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="font-headline text-3xl font-bold text-foreground">Monthly Reports</h1>
        <div className="relative w-full sm:w-auto sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reports by month..."
            className="w-full rounded-lg bg-background pl-8"
            // onChange={(e) => setSearchQuery(e.target.value)} // If client-side filtering
          />
        </div>
      </div>

      {reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
         <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No reports found.</p>
          <p className="mt-2 text-sm text-muted-foreground">Check back later or try adjusting your search.</p>
        </div>
      )}
    </div>
  );
}
