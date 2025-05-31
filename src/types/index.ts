export interface Trend {
  id: string;
  topic_name: string;
  source_url: string;
  popularity_metric: string; // e.g., "Search interest up 220%", "High engagement"
  category: string; // e.g., "Operations/Technology", "Marketing/Sales", "Customer Experience"
  date_collected: string; // ISO date string
  source_type: 'google_trends' | 'exploding_topics' | 'business_news'; // Simplified sources
}

export interface Report {
  id:string;
  month: string; // e.g., "June 2025"
  generated_at: string; // ISO date string
  report_markdown: string; // Content will be simplified and action-oriented
}
