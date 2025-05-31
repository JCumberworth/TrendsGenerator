import type { Trend } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Zap, MessageCircle, Cpu, Library, Newspaper, TrendingUp, CalendarDays, ExternalLink } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface TrendCardProps {
  trend: Trend;
}

const getSourceIcon = (sourceType: Trend['source_type']) => {
  switch (sourceType) {
    case 'google_trends':
      return <Globe className="h-4 w-4 text-muted-foreground" />;
    case 'exploding_topics':
      return <Zap className="h-4 w-4 text-muted-foreground" />;
    case 'reddit':
      return <MessageCircle className="h-4 w-4 text-muted-foreground" />; // Lucide doesn't have a Reddit icon
    default:
      return <Library className="h-4 w-4 text-muted-foreground" />;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'technology':
      return <Cpu className="h-4 w-4 mr-1" />;
    case 'education':
      return <Library className="h-4 w-4 mr-1" />;
    case 'environment':
      return <Newspaper className="h-4 w-4 mr-1" />; // Using Newspaper as a proxy for Environment/News
    case 'finance':
      return <TrendingUp className="h-4 w-4 mr-1" />; // Using TrendingUp for Finance
    default:
      return <Library className="h-4 w-4 mr-1" />;
  }
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
          {trend.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
          <span>Popularity: {trend.popularity_metric}</span>
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
          Collected: {format(parseISO(trend.date_collected), 'MMM d, yyyy')}
        </div>
      </CardFooter>
    </Card>
  );
}
