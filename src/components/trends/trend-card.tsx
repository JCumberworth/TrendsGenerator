import type { Trend } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Zap, Newspaper, TrendingUp, CalendarDays, ExternalLink, Building, Lightbulb, Users, Settings } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface TrendCardProps {
  trend: Trend;
}

const getSourceIcon = (sourceType: Trend['source_type']) => {
  switch (sourceType) {
    case 'google_trends':
      return <Globe className="h-4 w-4 text-muted-foreground" title="Google Trends" />;
    case 'exploding_topics':
      return <Zap className="h-4 w-4 text-muted-foreground" title="Exploding Topics" />;
    case 'business_news':
      return <Newspaper className="h-4 w-4 text-muted-foreground" title="Business News" />;
    default:
      return <Newspaper className="h-4 w-4 text-muted-foreground" title="Source" />;
  }
};

// Simplified category icons for business audience
const getCategoryIcon = (category: string) => {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('technology') || lowerCategory.includes('operations')) {
    return <Settings className="h-4 w-4 mr-1" />;
  }
  if (lowerCategory.includes('marketing') || lowerCategory.includes('sales')) {
    return <TrendingUp className="h-4 w-4 mr-1" />;
  }
  if (lowerCategory.includes('customer') || lowerCategory.includes('experience')) {
    return <Users className="h-4 w-4 mr-1" />;
  }
  if (lowerCategory.includes('human resources') || lowerCategory.includes('hr')) {
    return <Users className="h-4 w-4 mr-1" />;
  }
  if (lowerCategory.includes('strategy') || lowerCategory.includes('finance')) {
    return <Building className="h-4 w-4 mr-1" />;
  }
  return <Lightbulb className="h-4 w-4 mr-1" />; // Default icon
};


export function TrendCard({ trend }: TrendCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="font-headline text-xl">{trend.topic_name}</CardTitle>
          <a href={trend.source_url} target="_blank" rel="noopener noreferrer" aria-label={`View source for ${trend.topic_name}`}>
             {getSourceIcon(trend.source_type)}
          </a>
        </div>
        <CardDescription className="flex items-center text-sm">
          {getCategoryIcon(trend.category)}
          <Badge variant="outline">{trend.category}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground mb-2">
          <p className="font-semibold text-foreground">Relevance:</p>
          <p>{trend.popularity_metric}</p>
        </div>
         <a 
            href={trend.source_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            View Source <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground flex items-center">
          <CalendarDays className="h-3 w-3 mr-1" />
          Data as of: {format(parseISO(trend.date_collected), 'MMM d, yyyy')}
        </div>
      </CardFooter>
    </Card>
  );
}
