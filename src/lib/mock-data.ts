import type { Trend, Report } from '@/types';
import { subDays, subMonths, formatISO, format } from 'date-fns';

const currentDate = new Date();

export const mockTrends: Trend[] = [
  {
    id: 'biz-trend-1',
    topic_name: 'AI-Powered Customer Service Automation',
    source_url: 'https://trends.google.com/trends/explore?q=AI+Customer+Service',
    popularity_metric: 'Search interest up 180%',
    category: 'Customer Experience/Technology',
    date_collected: formatISO(subDays(currentDate, 5)),
    source_type: 'google_trends',
  },
  {
    id: 'biz-trend-2',
    topic_name: 'Hyper-Personalization in Marketing',
    source_url: 'https://explodingtopics.com/topic/hyper-personalization',
    popularity_metric: 'Significant growth in discussions',
    category: 'Marketing/Sales',
    date_collected: formatISO(subDays(currentDate, 12)),
    source_type: 'exploding_topics',
  },
  {
    id: 'biz-trend-3',
    topic_name: 'Remote Work Productivity Tools',
    source_url: 'https://www.forbes.com/advisor/business/software/best-remote-work-tools/', // Example business news source
    popularity_metric: 'High adoption rate by SMEs',
    category: 'Operations/Human Resources',
    date_collected: formatISO(subDays(currentDate, 3)),
    source_type: 'business_news',
  },
  {
    id: 'biz-trend-4',
    topic_name: 'Sustainable Business Practices',
    source_url: 'https://trends.google.com/trends/explore?q=Sustainable+Business',
    popularity_metric: 'Consumer demand increasing by 70%',
    category: 'Strategy/Environment',
    date_collected: formatISO(subDays(currentDate, 20)),
    source_type: 'google_trends',
  },
  {
    id: 'biz-trend-5',
    topic_name: 'Data-Driven Decision Making for SMEs',
    source_url: 'https://www.inc.com/guides/2010/05/data-driven-decision-making.html', // Example business news source
    popularity_metric: 'Increased adoption in small businesses',
    category: 'Strategy/Technology',
    date_collected: formatISO(subDays(currentDate, 8)),
    source_type: 'business_news',
  },
];

const previousMonthDate = subMonths(currentDate, 1);
const previousMonthName = format(previousMonthDate, 'MMMM yyyy');
const twoMonthsAgoDate = subMonths(currentDate, 2);
const twoMonthsAgoName = format(twoMonthsAgoDate, 'MMMM yyyy');


export const mockReports: Report[] = [
  {
    id: 'biz-report-1',
    month: previousMonthName,
    generated_at: formatISO(subDays(previousMonthDate, -5)), // Report generated early in the current month for previous month
    report_markdown: `
# 📊 **Monthly Business Trends Snapshot** – ${previousMonthName}

## ✅ **Top 3 Business Trends**

### 1. **AI-Powered Customer Service Automation**
- **Why it Matters:** Significantly reduces response times, improves customer satisfaction, and frees up human agents for complex issues. Can lead to substantial cost savings in customer support operations.
- **Simple Action:** Explore a free trial of a simple AI chatbot tool for your website to handle common customer inquiries.

### 2. **Hyper-Personalization in Marketing**
- **Why it Matters:** Leads to higher engagement rates, increased customer loyalty, and ultimately, more sales. Customers expect tailored experiences.
- **Simple Action:** Segment your email list based on past purchase history and send one targeted promotion this month.

### 3. **Remote Work Productivity Tools**
- **Why it Matters:** Essential for maintaining team efficiency and collaboration in hybrid or fully remote settings. Good tools reduce friction and improve morale.
- **Simple Action:** Survey your team about their current remote work tool pain points and research one alternative for a common issue.

## 📌 **Quick Wins & Recommendations**
- **Automate FAQs:** Identify your top 3 frequently asked customer questions and set up automated responses or a visible FAQ section.
- **Personalize Welcome Emails:** If you have an email list, customize the welcome email to include the subscriber's name.
- **Centralize Project Updates:** Pick one tool (even a shared document) for all project updates this week to improve clarity.

## 🔗 **Additional Resources**
- [Article: Getting Started with AI Chatbots for Small Business](https://www.example.com/ai-chatbots-smb)
- [Guide: Beginner's Guide to Email Segmentation](https://www.example.com/email-segmentation-guide)
    `,
  },
  {
    id: 'biz-report-2',
    month: twoMonthsAgoName,
    generated_at: formatISO(subDays(twoMonthsAgoDate, -5)),
    report_markdown: `
# 📊 **Monthly Business Trends Snapshot** – ${twoMonthsAgoName}

## ✅ **Top 3 Business Trends**

### 1. **Sustainable Business Practices**
- **Why it Matters:** Attracts environmentally conscious consumers, can reduce operational costs (e.g., energy savings), and enhances brand reputation.
- **Simple Action:** Conduct a quick audit of your office's energy consumption or waste production and identify one small change (e.g., switching to LED bulbs, improving recycling).

### 2. **Data-Driven Decision Making for SMEs**
- **Why it Matters:** Helps small and medium-sized enterprises make informed choices, optimize resource allocation, and identify new market opportunities, moving away from guesswork.
- **Simple Action:** Review your website analytics for the past month to understand your most popular pages or referral sources.

### 3. **Employee Wellness Programs**
- **Why it Matters:** Improves employee morale, reduces burnout, and can lead to increased productivity and lower staff turnover.
- **Simple Action:** Share a free online resource about stress management or mindfulness with your team.

## 📌 **Quick Wins & Recommendations**
- **Eco-friendly Packaging:** If you sell physical products, research one eco-friendly packaging alternative.
- **Track a Key Metric:** Choose one key business metric (e.g., website conversion rate, customer acquisition cost) and track it consistently for the next month.
- **Offer Flexible Breaks:** Encourage employees to take short, regular breaks to improve focus and well-being.

## 🔗 **Additional Resources**
- [Tips: Easy Sustainability Wins for Your Business](https://www.example.com/sustainability-tips)
- [Article: How Small Businesses Can Use Data Effectively](https://www.example.com/smb-data-analytics)
    `,
  },
];
