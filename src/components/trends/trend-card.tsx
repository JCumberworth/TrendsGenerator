
import type { Trend } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Zap, Newspaper, TrendingUp, CalendarDays, ExternalLink, Building, Lightbulb, Users, Settings, MessageSquare, YoutubeIcon, TwitterIcon, LinkedinIcon } from 'lucide-react';
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
    case 'reddit':
      return <MessageSquare className="h-4 w-4 text-muted-foreground" title="Reddit" />; // Using MessageSquare for Reddit, consider a specific Reddit icon if available/added
    case 'youtube':
      return <YoutubeIcon className="h-4 w-4 text-muted-foreground" title="YouTube" />;
    case 'twitter_x':
      return <TwitterIcon className="h-4 w-4 text-muted-foreground" title="Twitter/X" />;
    case 'linkedin':
      return <LinkedinIcon className="h-4 w-4 text-muted-foreground" title="LinkedIn" />;
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
   if (lowerCategory.includes('legal')) {
    return <Building className="h-4 w-4 mr-1" />; // Using Building for Legal, can be more specific
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
          <Badge variant="outline" className="mr-2">{trend.category}</Badge>
          {trend.sentiment_score && (
            <Badge variant={trend.sentiment_score === 'Positive' ? 'default' : trend.sentiment_score === 'Negative' ? 'destructive' : 'secondary'}>
              {trend.sentiment_score}
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground mb-2">
          <p className="font-semibold text-foreground">Relevance/Popularity:</p>
          <p>{trend.popularity_metric}</p>
          {trend.source_details?.subreddit && <p className="text-xs">Subreddit: r/{trend.source_details.subreddit}</p>}
          {trend.source_details?.upvotes && <p className="text-xs">Upvotes: {trend.source_details.upvotes}</p>}
          {trend.source_details?.video_title && <p className="text-xs truncate" title={trend.source_details.video_title}>Video: {trend.source_details.video_title}</p>}
          {trend.source_details?.views && <p className="text-xs">Views: {trend.source_details.views.toLocaleString()}</p>}
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
