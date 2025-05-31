import { TrendCard } from '@/components/trends/trend-card';
import { mockTrends } from '@/lib/mock-data';
import type { Trend } from '@/types';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function TrendsPage() {
  const trends: Trend[] = mockTrends;

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="font-headline text-3xl font-bold text-foreground">Key Business Trends</h1>
        <div className="relative w-full sm:w-auto sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search key trends..."
            className="w-full rounded-lg bg-background pl-8"
            // onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
       <p className="text-muted-foreground mb-8 -mt-4 max-w-2xl">
        Discover important trends relevant to your business, with simplified metrics and sources.
      </p>

      {trends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trends.map((trend) => (
            <TrendCard key={trend.id} trend={trend} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No key trends found.</p>
          <p className="mt-2 text-sm text-muted-foreground">Check back later or try adjusting your search.</p>
        </div>
      )}
    </div>
  );
}
