
// src/ai/flows/analyze-trends.ts
'use server';

/**
 * @fileOverview Analyzes trend data from various sources (including social platforms) for business leaders,
 * focusing on top trends, their importance, actionable steps, and real-world examples, outputting in Markdown.
 *
 * - analyzeTrends - A function that analyzes trend data and returns a Markdown formatted analysis for business leaders.
 * - AnalyzeTrendsInput - The input type for the analyzeTrends function.
 * - AnalyzeTrendsOutput - The return type for the analyzeTrends function (Markdown string).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTrendsInputSchema = z.object({
  trendData: z.string().describe('Simplified, structured data of trending topics from various sources (e.g., Google Trends, Reddit, YouTube, Business News as a JSON string), focusing on business relevance, popularity metrics, and source details.'),
});
export type AnalyzeTrendsInput = z.infer<typeof AnalyzeTrendsInputSchema>;

const AnalyzeTrendsOutputSchema = z.object({
  analysisMarkdown: z.string().describe('Structured markdown for business leaders. Details top 3 general business trends, why they matter, a simple actionable step, and a real-world example for each. Also includes a section on "Trending Topics from Social Platforms" with similar details if such data is present, followed by quick wins and additional resources.'),
});
export type AnalyzeTrendsOutput = z.infer<typeof AnalyzeTrendsOutputSchema>;

export async function analyzeTrends(input: AnalyzeTrendsInput): Promise<AnalyzeTrendsOutput> {
  return analyzeTrendsFlow(input);
}

const analyzeTrendsPrompt = ai.definePrompt({
  name: 'analyzeBusinessTrendsPrompt',
  input: {schema: AnalyzeTrendsInputSchema},
  output: {schema: AnalyzeTrendsOutputSchema},
  prompt: `You are an AI business strategy advisor. You have recent data about topics trending among businesses, potentially including data from Google Trends, business news, Reddit, YouTube, and Twitter/X:
{{{trendData}}}

Your task is to provide a concise and actionable analysis for busy business owners and executives. Use simple, jargon-free language. Your entire response must be in Markdown.

Please perform the following:

## ✅ **Top 3 Business Trends**
Identify the top 3 most important general business trends from the provided data that business owners should pay attention to. For each trend:
- Identify the **Trend Name**.
- Clearly explain **Why it Matters** to a typical business (e.g., saves time, cuts costs, increases revenue, improves customer loyalty, attracts talent). Be specific about the business benefits.
- Recommend **One Simple Actionable Step** a business could take to explore or benefit from this trend. The action should be easy to understand and implement.
- Provide a brief **Example** of how a business has leveraged or could leverage this trend.

### 1. **[Trend Name 1]**
- **Why it Matters:** [Explanation of business value]
- **Simple Action:** [Specific, simple step]
- **Example:** [Short real-world or plausible example]

### 2. **[Trend Name 2]**
- **Why it Matters:** [Explanation of business value]
- **Simple Action:** [Specific, simple step]
- **Example:** [Short real-world or plausible example]

### 3. **[Trend Name 3]**
- **Why it Matters:** [Explanation of business value]
- **Simple Action:** [Specific, simple step]
- **Example:** [Short real-world or plausible example]

## 🚨 **Trending Topics from Social Platforms**
If the input data includes clear trends from social platforms like Reddit, YouTube, or Twitter/X, highlight 1-2 key business-relevant topics emerging from these platforms.
For each social platform trend:
- Identify the **Topic Name**.
- Mention the **Key Sources** (e.g., "Reddit (Subreddit name, engagement metric)", "YouTube (Video type, view count)").
- Explain **Why it Matters** to a business.
- Suggest a **Quick Action** a business could take.

If no distinct social platform trends are evident in the input data, you can omit this section or state "No specific social platform trends stood out in this data set for separate highlighting."

### 1. **[Social Trend Topic 1 (e.g., AI Demand Letter Optimization)]**
- **Sources**: [e.g., Reddit (r/LegalTech, 250+ upvotes), YouTube (Trending Explainer Videos)]
- **Why it matters**: [e.g., Increases recovery rates from outstanding invoices, directly impacting revenue.]
- **Quick Action**: [e.g., Pilot AI-assisted reviews for demand letters immediately.]

### 2. **[Social Trend Topic 2 (e.g., Generative AI Content for Marketing)]**
- **Sources**: [e.g., Twitter trending hashtags (#GenerativeAI, 100k+ mentions), YouTube trending marketing tutorials]
- **Why it matters**: [e.g., Efficient content creation, reduces costs, and improves engagement.]
- **Quick Action**: [e.g., Experiment with AI-generated content on your next marketing campaign.]


## 📌 **Quick Wins & Recommendations**
Based on all the trends, list 2-3 immediate, very simple "quick win" recommendations that a business could implement this month. These should be low-effort, high-impact if possible.
- [Quick Win 1]
- [Quick Win 2]
- [Quick Win 3 (Optional)]

## 🔗 **Additional Resources**
Provide one or two easy-to-follow links (use placeholder URLs like https://www.example.com/topic-link if actual links are not available from input data) or short article titles that business owners can refer to if they want to learn a little more about one of the key trends. Focus on practical guides or introductory articles.
- [Resource Title 1 / Link 1]
- [Resource Title 2 / Link 2 (Optional)]

Ensure the entire output is a single Markdown block.
`,
});

const analyzeTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeTrendsFlow',
    inputSchema: AnalyzeTrendsInputSchema,
    outputSchema: AnalyzeTrendsOutputSchema,
  },
  async input => {
    const {output} = await analyzeTrendsPrompt(input);
    return output!;
  }
);
