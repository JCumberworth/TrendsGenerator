// src/ai/flows/analyze-trends.ts
'use server';

/**
 * @fileOverview Analyzes trend data for business leaders, focusing on top trends, their importance, and actionable steps, outputting in Markdown.
 *
 * - analyzeTrends - A function that analyzes trend data and returns a Markdown formatted analysis for business leaders.
 * - AnalyzeTrendsInput - The input type for the analyzeTrends function.
 * - AnalyzeTrendsOutput - The return type for the analyzeTrends function (Markdown string).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTrendsInputSchema = z.object({
  trendData: z.string().describe('Structured data of trending topics from various sources (e.g., JSON stringified), simplified for business relevance.'),
});
export type AnalyzeTrendsInput = z.infer<typeof AnalyzeTrendsInputSchema>;

const AnalyzeTrendsOutputSchema = z.object({
  analysisMarkdown: z.string().describe('Structured markdown for business leaders, detailing top 3 trends, why they matter, and one simple actionable step for each. Also includes quick wins and additional resources.'),
});
export type AnalyzeTrendsOutput = z.infer<typeof AnalyzeTrendsOutputSchema>;

export async function analyzeTrends(input: AnalyzeTrendsInput): Promise<AnalyzeTrendsOutput> {
  return analyzeTrendsFlow(input);
}

const analyzeTrendsPrompt = ai.definePrompt({
  name: 'analyzeBusinessTrendsPrompt',
  input: {schema: AnalyzeTrendsInputSchema},
  output: {schema: AnalyzeTrendsOutputSchema},
  prompt: `You are an AI business strategy advisor. You have recent data about topics trending among businesses:
{{{trendData}}}

Your task is to provide a concise and actionable analysis for busy business owners and executives. Use simple, jargon-free language.

Please perform the following and structure your entire response in Markdown:

## ✅ **Top 3 Business Trends**
For each of the top 3 most important trends relevant to a typical business:
- Identify the **Trend Name**.
- Clearly explain **Why it Matters** to a business (e.g., saves time, cuts costs, increases revenue, improves customer loyalty, attracts talent). Be specific about the business benefits.
- Recommend **One Simple Actionable Step** a business could take to explore or benefit from this trend. The action should be easy to understand and implement.

### 1. **[Trend Name 1]**
- **Why it Matters:** [Explanation of business value]
- **Simple Action:** [Specific, simple step]

### 2. **[Trend Name 2]**
- **Why it Matters:** [Explanation of business value]
- **Simple Action:** [Specific, simple step]

### 3. **[Trend Name 3]**
- **Why it Matters:** [Explanation of business value]
- **Simple Action:** [Specific, simple step]

## 📌 **Quick Wins & Recommendations**
Based on the trends, list 2-3 immediate, very simple "quick win" recommendations that a business could implement this month. These should be low-effort, high-impact if possible.
- [Quick Win 1]
- [Quick Win 2]
- [Quick Win 3 (Optional)]

## 🔗 **Additional Resources**
Provide one or two easy-to-follow links (use placeholder URLs like https://www.example.com/topic-link if actual links are not available from input) or short article titles that business owners can refer to if they want to learn a little more about one of the key trends. Focus on practical guides or introductory articles.
- [Resource Title 1/Link 1]
- [Resource Title 2/Link 2 (Optional)]

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
