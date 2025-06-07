
import { saveTrendsData, saveReportsData } from '../src/lib/data-store';
import { generatePotentialTrends } from '../src/ai/flows/generate-potential-trends-flow';
import { analyzeTrends } from '../src/ai/flows/analyze-trends';
import { generateReport } from '../src/ai/flows/generate-reports';
import type { Trend } from '../src/types';
import { formatISO, format } from 'date-fns';

async function fetchTrendsFromAPI(): Promise<Trend[]> {
  const trends: Trend[] = [];
  
  // Specific prompts targeting actionable business opportunities
  const targetedPrompts = [
    {
      keyword: 'YouTube creator economy pain points',
      category: 'Creator Tools/SaaS',
      context: 'Tools that help YouTubers with editing, analytics, sponsorship management, or audience engagement'
    },
    {
      keyword: 'Reddit business automation trending',
      category: 'Social Media/Automation',
      context: 'Services that help businesses manage Reddit presence, community building, or customer support on Reddit'
    },
    {
      keyword: 'TikTok small business marketing gaps',
      category: 'Marketing/Social Media',
      context: 'Apps or services that help small businesses create, schedule, or analyze TikTok content effectively'
    },
    {
      keyword: 'remote team collaboration frustrations',
      category: 'Productivity/Remote Work',
      context: 'Solutions for specific remote work challenges like async communication, time zone management, or virtual team building'
    },
    {
      keyword: 'AI customer service implementation challenges',
      category: 'AI/Customer Service',
      context: 'Tools that make AI chatbot setup easier for non-technical business owners or improve existing AI customer service'
    },
    {
      keyword: 'sustainable packaging startup opportunities',
      category: 'Sustainability/E-commerce',
      context: 'Services that help e-commerce businesses find, source, or implement eco-friendly packaging solutions'
    },
    {
      keyword: 'local business digital transformation needs',
      category: 'Local Business/Technology',
      context: 'Apps or services that help traditional local businesses (restaurants, retail, services) adopt digital tools'
    },
    {
      keyword: 'freelancer financial management pain points',
      category: 'Fintech/Freelancing',
      context: 'Tools for freelancers to handle invoicing, tax preparation, expense tracking, or irregular income management'
    }
  ];

  for (const prompt of targetedPrompts) {
    try {
      const result = await generatePotentialTrends({ topicKeyword: `${prompt.keyword} - Focus on specific problems that could be solved with a new app, SaaS tool, or service. Think about gaps in existing solutions and emerging needs in ${prompt.context}` });
      
      // Convert potential trends to Trend objects
      const categoryTrends: Trend[] = result.potentialTrends.map((trendName, index) => ({
        id: `actionable-${prompt.keyword.replace(/\s+/g, '-')}-${index}`,
        topic_name: trendName,
        source_url: `https://trends.google.com/trends/explore?q=${encodeURIComponent(trendName)}`,
        popularity_metric: 'Actionable business opportunity identified',
        category: prompt.category,
        date_collected: formatISO(new Date()),
        source_type: 'targeted_analysis' as any,
        sentiment_score: 'Positive'
      }));
      
      trends.push(...categoryTrends.slice(0, 1)); // Take 1 trend per prompt to avoid overwhelming
    } catch (error) {
      console.error(`Error generating trends for ${prompt.keyword}:`, error);
    }
  }

  return trends.slice(0, 8); // Limit to 8 fresh actionable trends
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
