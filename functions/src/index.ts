import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { mockTrends } from '../mock-data';

// HTTP function to return trending data
export const listTrends = onRequest((req, res) => {
  logger.info('Returning trend data');
  res.json({ trends: mockTrends });
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
