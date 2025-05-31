// src/ai/flows/analyze-trends.ts
'use server';

/**
 * @fileOverview Analyzes scraped trend data to summarize key insights and identify top and fastest-growing trends.
 *
 * - analyzeTrends - A function that analyzes trend data and returns key insights.
 * - AnalyzeTrendsInput - The input type for the analyzeTrends function.
 * - AnalyzeTrendsOutput - The return type for the analyzeTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTrendsInputSchema = z.object({
  trendData: z.string().describe('Structured data of trending topics from Firestore.'),
});
export type AnalyzeTrendsInput = z.infer<typeof AnalyzeTrendsInputSchema>;

const AnalyzeTrendsOutputSchema = z.object({
  topTrends: z.array(z.string()).describe('List of the top 5 trending topics.'),
  fastestGrowingTrend: z.string().describe('The fastest-growing trending topic.'),
  insights: z.array(z.string()).describe('Key insights and potential reasons behind the trends.'),
});
export type AnalyzeTrendsOutput = z.infer<typeof AnalyzeTrendsOutputSchema>;

export async function analyzeTrends(input: AnalyzeTrendsInput): Promise<AnalyzeTrendsOutput> {
  return analyzeTrendsFlow(input);
}

const analyzeTrendsPrompt = ai.definePrompt({
  name: 'analyzeTrendsPrompt',
  input: {schema: AnalyzeTrendsInputSchema},
  output: {schema: AnalyzeTrendsOutputSchema},
  prompt: `You have recent web data on trending topics:
{{{trendData}}}

Tasks:
1. Identify and list the top 5 trending topics.
2. Briefly explain potential reasons behind their recent popularity.
3. Highlight the fastest-growing topic.

Provide a clear and structured response.`,
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
