import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';

interface Trend {
  id: string;
  topic_name: string;
  source_url: string;
  popularity_metric: string;
  category: string;
  date_collected: string;
  source_type:
    | 'google_trends'
    | 'exploding_topics'
    | 'business_news'
    | 'reddit'
    | 'youtube'
    | 'twitter_x'
    | 'linkedin';
  source_details?: Record<string, any> | null;
  sentiment_score?: string;
}

const EXPLODING_TOPICS_API_KEY = process.env.EXPLODING_TOPICS_API_KEY;

async function fetchGoogleTrends(geo = 'US'): Promise<Trend[]> {
  const url =
    `https://trends.google.com/trends/api/dailytrends?hl=en-US&geo=${geo}&ns=15`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      logger.error('Failed to fetch Google Trends', resp.statusText);
      return [];
    }
    const text = await resp.text();
    const json = JSON.parse(text.substring(text.indexOf('{')));
    const searches =
      json.default.trendingSearchesDays?.[0]?.trendingSearches ?? [];
    return searches.map((s: any) => ({
      id: `google-${s.title.query.replace(/\s+/g, '-')}`,
      topic_name: s.title.query,
      source_url: s.shareUrl,
      popularity_metric: s.formattedTraffic ?? 'unknown',
      category: 'General',
      date_collected: new Date().toISOString(),
      source_type: 'google_trends',
    }));
  } catch (err) {
    logger.error('Error fetching Google Trends', err);
    return [];
  }
}

async function fetchRedditTopPosts(subreddit = 'technology'): Promise<Trend[]> {
  const url = `https://www.reddit.com/r/${subreddit}/top.json?limit=5&t=day`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      logger.error('Failed to fetch Reddit posts', resp.statusText);
      return [];
    }
    const json = await resp.json();
    const posts = json.data?.children ?? [];
    return posts.map((p: any) => ({
      id: `reddit-${p.data.id}`,
      topic_name: p.data.title,
      source_url: `https://www.reddit.com${p.data.permalink}`,
      popularity_metric: `Upvotes ${p.data.ups}`,
      category: 'Reddit',
      date_collected: new Date().toISOString(),
      source_type: 'reddit',
      source_details: {
        subreddit,
        upvotes: p.data.ups,
        comments: p.data.num_comments,
      },
    }));
  } catch (err) {
    logger.error('Error fetching Reddit posts', err);
    return [];
  }
}

async function fetchExplodingTopics(): Promise<Trend[]> {
  if (!EXPLODING_TOPICS_API_KEY) {
    logger.warn('EXPLODING_TOPICS_API_KEY not set');
    return [];
  }
  const url =
    `https://api.explodingtopics.com/topics/weekly?api_key=${EXPLODING_TOPICS_API_KEY}`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      logger.error('Failed to fetch Exploding Topics', resp.statusText);
      return [];
    }
    const json = await resp.json();
    const topics = json.topics ?? json;
    return (topics as any[]).slice(0, 5).map((t: any) => ({
      id: `exploding-${(t.topic ?? t.name).replace(/\s+/g, '-')}`,
      topic_name: t.topic ?? t.name,
      source_url: t.url,
      popularity_metric: `${t.growth}% growth`,
      category: t.category ?? 'General',
      date_collected: new Date().toISOString(),
      source_type: 'exploding_topics',
    }));
  } catch (err) {
    logger.error('Error fetching Exploding Topics', err);
    return [];
  }
}

// HTTP function to return trending data from multiple sources
export const listTrends = onRequest(async (req, res) => {
  logger.info('Fetching trend data');
  try {
    const [google, reddit, exploding] = await Promise.all([
      fetchGoogleTrends(req.query.geo as string ?? 'US'),
      fetchRedditTopPosts(req.query.subreddit as string ?? 'technology'),
      fetchExplodingTopics(),
    ]);
    const trends = [...google, ...reddit, ...exploding];
    res.json({ trends });
  } catch (err) {
    logger.error('Error aggregating trend data', err);
    res.status(500).json({ error: 'Failed to fetch trend data' });
  }
});

// Generate potential business ideas based on a keyword
export const generateIdeas = onRequest((req, res) => {
  const keyword = req.body?.topicKeyword || req.query.keyword;
  if (!keyword || typeof keyword !== 'string') {
    res.status(400).json({ error: 'topicKeyword is required' });
    return;
  }
  // Simple mocked idea generation combining the keyword
  const ideas = Array.from({ length: 3 }, (_, i) => `${keyword} Idea ${i + 1}`);
  res.json({ potentialTrends: ideas });
});

// Analyze a potential idea and return a markdown response
export const analyzeIdea = onRequest((req, res) => {
  const trendName = req.body?.trendName || req.query.trendName;
  if (!trendName || typeof trendName !== 'string') {
    res.status(400).json({ error: 'trendName is required' });
    return;
  }
  const analysis = `## Analysis for ${trendName}\n- Opportunity: Example opportunity.\n- Target Audience: Example audience.\n- Challenges: Example challenges.`;
  res.json({ analysisMarkdown: analysis });
});

// Analyze a block of trend data
export const analyzeTrends = onRequest((req, res) => {
  const trendData = req.body?.trendData;
  if (!trendData || typeof trendData !== 'string') {
    res.status(400).json({ error: 'trendData is required' });
    return;
  }
  const analysis = `# Trend Analysis\nData provided:\n${trendData}`;
  res.json({ analysisMarkdown: analysis });
});

// Generate a simple monthly report
export const generateReport = onRequest((req, res) => {
  const month = req.body?.month;
  const markdown = req.body?.analysisMarkdown;
  if (!month || !markdown) {
    res.status(400).json({ error: 'month and analysisMarkdown are required' });
    return;
  }
  const report = `# Report for ${month}\n\n${markdown}`;
  res.json({ reportMarkdown: report });
});
