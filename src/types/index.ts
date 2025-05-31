export interface Trend {
  id: string;
  topic_name: string;
  source_url: string;
  popularity_metric: string;
  category: string;
  date_collected: string; // ISO date string
  source_type: 'google_trends' | 'exploding_topics' | 'reddit';
}

export interface Report {
  id:string;
  month: string; // e.g., "June 2025"
  generated_at: string; // ISO date string
  report_markdown: string;
}
