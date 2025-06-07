
import { saveTrendsData, saveReportsData } from '../src/lib/data-store';
import { generatePotentialTrends } from '../src/ai/flows/generate-potential-trends-flow';
import { analyzeTrends } from '../src/ai/flows/analyze-trends';
import { generateReport } from '../src/ai/flows/generate-reports';
import type { Trend } from '../src/types';
import { formatISO, format } from 'date-fns';

async function fetchTrendsFromAPI(): Promise<Trend[]> {
  const trends: Trend[] = [];
  
  // Generate trends for different business categories
  const categories = [
    'artificial intelligence business',
    'remote work tools',
    'sustainable business',
    'e-commerce automation',
    'customer experience technology'
  ];

  for (const category of categories) {
    try {
      const result = await generatePotentialTrends({ topicKeyword: category });
      
      // Convert potential trends to Trend objects
      const categoryTrends: Trend[] = result.potentialTrends.map((trendName, index) => ({
        id: `fresh-${category.replace(/\s+/g, '-')}-${index}`,
        topic_name: trendName,
        source_url: `https://trends.google.com/trends/explore?q=${encodeURIComponent(trendName)}`,
        popularity_metric: 'AI-generated trend analysis',
        category: category.charAt(0).toUpperCase() + category.slice(1),
        date_collected: formatISO(new Date()),
        source_type: 'ai_generated' as any,
        sentiment_score: 'Positive'
      }));
      
      trends.push(...categoryTrends.slice(0, 2)); // Take 2 trends per category
    } catch (error) {
      console.error(`Error generating trends for ${category}:`, error);
    }
  }

  return trends.slice(0, 10); // Limit to 10 fresh trends
}

async function generateDailyReport(): Promise<void> {
  try {
    const trends = await fetchTrendsFromAPI();
    const trendData = trends.map(t => `${t.topic_name} (${t.category})`).join('\n');
    
    const analysis = await analyzeTrends({ trendData });
    const currentMonth = format(new Date(), 'MMMM yyyy');
    
    const report = await generateReport({
      month: currentMonth,
      analysisMarkdown: analysis.analysisMarkdown
    });

    await saveReportsData([{
      id: `daily-report-${formatISO(new Date()).split('T')[0]}`,
      month: currentMonth,
      generated_at: formatISO(new Date()),
      report_markdown: report.reportMarkdown
    }]);

    console.log('Daily report generated successfully');
  } catch (error) {
    console.error('Error generating daily report:', error);
  }
}

async function main() {
  console.log('Fetching daily trends...');
  
  try {
    // Fetch fresh trends
    const freshTrends = await fetchTrendsFromAPI();
    await saveTrendsData(freshTrends);
    console.log(`Saved ${freshTrends.length} fresh trends`);

    // Generate daily report
    await generateDailyReport();
    
    console.log('Daily data update completed');
  } catch (error) {
    console.error('Error in daily data fetch:', error);
    process.exit(1);
  }
}

main();
