// src/ai/flows/analyze-trends.ts
'use server';

/**
 * @fileOverview Analyzes scraped trend data to summarize key insights, identify top/fastest-growing trends, and predict reasons, outputting in Markdown.
 *
 * - analyzeTrends - A function that analyzes trend data and returns a Markdown formatted analysis.
 * - AnalyzeTrendsInput - The input type for the analyzeTrends function.
 * - AnalyzeTrendsOutput - The return type for the analyzeTrends function (Markdown string).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTrendsInputSchema = z.object({
  trendData: z.string().describe('Structured data of trending topics from various sources (e.g., JSON stringified).'),
});
export type AnalyzeTrendsInput = z.infer<typeof AnalyzeTrendsInputSchema>;

const AnalyzeTrendsOutputSchema = z.object({
  analysisMarkdown: z.string().describe('Structured markdown summarizing trend analysis, including top 10 topics with explanations, fastest growing trends with analysis, and overall insights/predictions.'),
});
export type AnalyzeTrendsOutput = z.infer<typeof AnalyzeTrendsOutputSchema>;

export async function analyzeTrends(input: AnalyzeTrendsInput): Promise<AnalyzeTrendsOutput> {
  return analyzeTrendsFlow(input);
}

const analyzeTrendsPrompt = ai.definePrompt({
  name: 'analyzeTrendsPrompt',
  input: {schema: AnalyzeTrendsInputSchema},
  output: {schema: AnalyzeTrendsOutputSchema},
  prompt: `You are an AI trends analyst. You have received structured data on trending topics from various web sources:
{{{trendData}}}

Based on this data, perform the following analysis and return your entire answer in a structured Markdown format, suitable for direct inclusion in a larger report. Do not include a top-level heading like "# Trend Analysis", as this markdown will be embedded.

Your analysis should include these sections:

## 🔥 Top 10 Trending Topics:
List the top 10 trending topics. For each topic:
- Clearly state the **Topic Name**.
- Provide a brief explanation of the topic and why it's trending.

## 📈 Fastest Growing Trends:
Identify 2-3 topics that are showing the fastest growth. For each:
- State the **Topic Name**.
- Include its growth rate or other relevant metrics if available in the input data.
- Provide a short analysis of its growth and potential reasons.

## 💡 Insights and Predictions:
Offer 2-3 key insights derived from the overall trend data.
Make predictions about potential future developments or related emerging trends.
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
