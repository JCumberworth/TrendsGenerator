import type { Trend, Report } from '@/types';
import { subDays, formatISO } from 'date-fns';

export const mockTrends: Trend[] = [
  {
    id: '1',
    topic_name: 'Quantum Entanglement Communication',
    source_url: 'https://trends.google.com/trends/explore?q=Quantum+Entanglement+Communication',
    popularity_metric: '+350%',
    category: 'Technology',
    date_collected: formatISO(subDays(new Date(), 2)),
    source_type: 'google_trends',
  },
  {
    id: '2',
    topic_name: 'AI-Powered Personalized Education',
    source_url: 'https://explodingtopics.com/topic/ai-personalized-education',
    popularity_metric: '+280%',
    category: 'Education',
    date_collected: formatISO(subDays(new Date(), 5)),
    source_type: 'exploding_topics',
  },
  {
    id: '3',
    topic_name: 'Sustainable Urban Farming',
    source_url: 'https://www.reddit.com/r/UrbanGardening/top',
    popularity_metric: 'Top Subreddit',
    category: 'Environment',
    date_collected: formatISO(subDays(new Date(), 1)),
    source_type: 'reddit',
  },
  {
    id: '4',
    topic_name: 'Decentralized Autonomous Organizations (DAOs)',
    source_url: 'https://trends.google.com/trends/explore?q=DAO',
    popularity_metric: '+150%',
    category: 'Finance',
    date_collected: formatISO(subDays(new Date(), 10)),
    source_type: 'google_trends',
  },
  {
    id: '5',
    topic_name: 'Neuro-symbolic AI',
    source_url: 'https://explodingtopics.com/topic/neuro-symbolic-ai',
    popularity_metric: '+220%',
    category: 'Technology',
    date_collected: formatISO(subDays(new Date(), 7)),
    source_type: 'exploding_topics',
  },
];

export const mockReports: Report[] = [
  {
    id: 'report-1',
    month: 'July 2024',
    generated_at: formatISO(subDays(new Date(), 3)),
    report_markdown: `
# 🚀 Monthly Trends Report – July 2024

## 🔥 Top 5 Trending Topics
1. **Quantum Entanglement Communication** – Rapid advancements in quantum physics are pushing this theoretical communication method closer to reality, sparking interest in its potential for unhackable networks.
2. **AI-Powered Personalized Education** – As AI models become more sophisticated, their application in tailoring learning experiences to individual student needs is gaining significant traction.
3. **Sustainable Urban Farming** – Growing concerns about food security and environmental impact are driving innovation and adoption of urban farming solutions.
4. **Neuro-symbolic AI** – This hybrid AI approach, combining neural networks with symbolic reasoning, is showing promise in overcoming limitations of current deep learning models.
5. **Metaverse Land Speculation** – Despite market fluctuations, interest in virtual real estate within metaverse platforms continues, driven by long-term potential.


## 📈 Fastest Growing Trend
- **Quantum Entanglement Communication (+350%)** – Recent breakthroughs and increased media coverage have led to a surge in public and academic interest.

## 💡 Brief Insights
- Insight 1: The tech sector continues to dominate emerging trends, particularly in AI and quantum computing.
- Insight 2: Sustainability and personalized experiences are cross-cutting themes appearing in multiple trending topics.
    `,
  },
  {
    id: 'report-2',
    month: 'June 2024',
    generated_at: formatISO(subDays(new Date(), 33)),
    report_markdown: `
# 🚀 Monthly Trends Report – June 2024

## 🔥 Top 5 Trending Topics
1. **Generative AI Art Tools** – Increased accessibility and capabilities of tools like Midjourney and DALL-E are fueling creative explosions.
2. **Remote Work Optimization Software** – Companies continue to invest in tools that enhance productivity and collaboration for distributed teams.
3. **Circular Economy Models** – Businesses are increasingly exploring models that minimize waste and maximize resource utilization.
4. **Mental Wellness Apps for Gen Z** – A growing focus on mental health, particularly among younger generations, is driving demand for supportive digital tools.
5. **Ethical AI Frameworks** – As AI becomes more pervasive, discussions and development around ethical guidelines are intensifying.

## 📈 Fastest Growing Trend
- **Generative AI Art Tools (+450%)** – Viral content and ease of use have made these tools extremely popular across various demographics.

## 💡 Brief Insights
- Insight 1: AI's influence is expanding beyond technical fields into creative and societal domains.
- Insight 2: There's a strong societal push towards more sustainable and ethical practices, reflected in trending business models and technologies.
    `,
  },
];
