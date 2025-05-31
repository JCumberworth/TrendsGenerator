
'use server';
/**
 * @fileOverview Analyzes a single potential trend name to provide an in-depth analysis, reasons for trending, and predictions.
 *
 * - analyzePotentialTrend - A function that analyzes a single potential trend.
 * - AnalyzePotentialTrendInput - The input type for the analyzePotentialTrend function.
 * - AnalyzePotentialTrendOutput - The return type for the analyzePotentialTrend function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePotentialTrendInputSchema = z.object({
  trendName: z.string().describe('The name of the potential trend to analyze.'),
});
export type AnalyzePotentialTrendInput = z.infer<typeof AnalyzePotentialTrendInputSchema>;

const AnalyzePotentialTrendOutputSchema = z.object({
  analysisMarkdown: z.string().describe('A detailed Markdown-formatted analysis of the potential trend, including explanation, reasons for trending, related concepts, insights, and predictions.'),
});
export type AnalyzePotentialTrendOutput = z.infer<typeof AnalyzePotentialTrendOutputSchema>;

export async function analyzePotentialTrend(input: AnalyzePotentialTrendInput): Promise<AnalyzePotentialTrendOutput> {
  return analyzePotentialTrendFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePotentialTrendPrompt',
  input: {schema: AnalyzePotentialTrendInputSchema},
  output: {schema: AnalyzePotentialTrendOutputSchema},
  prompt: `You are an AI trends analyst. A user is interested in exploring the potential of the following trend:
**Trend Topic: "{{{trendName}}}"**

Based *only* on this topic name, provide an in-depth analysis in Markdown format. Do not invent or assume any pre-existing structured data for this topic. Your entire response should be the Markdown content.

Your analysis should include these sections:

## 🔍 In-depth Analysis of "{{{trendName}}}"
- Provide a concise explanation of what "{{{trendName}}}" likely entails.
- Discuss 2-3 potential reasons why this topic might be emerging or could become a significant trend. Consider societal shifts, technological advancements, market needs, etc.
- What are 2-3 potential related concepts, sub-trends, or affected industries?

## 💡 Potential Insights and Predictions
- Offer 2-3 key insights that could be derived if "{{{trendName}}}" were to become a widespread trend.
- Make 1-2 predictions about its potential development, impact, or evolution over the next 1-3 years.

Ensure your analysis is speculative but grounded in logical reasoning based on the provided trend name.
`,
});

const analyzePotentialTrendFlow = ai.defineFlow(
  {
    name: 'analyzePotentialTrendFlow',
    inputSchema: AnalyzePotentialTrendInputSchema,
    outputSchema: AnalyzePotentialTrendOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
