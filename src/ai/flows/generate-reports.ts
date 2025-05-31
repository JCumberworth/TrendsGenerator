'use server';

/**
 * @fileOverview Generates monthly trend reports in Markdown format from AI-generated insights.
 *
 * - generateReport - A function to generate the report.
 * - GenerateReportInput - The input type for the generateReport function.
 * - GenerateReportOutput - The return type for the generateReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportInputSchema = z.object({
  month: z.string().describe('The month for which the report is generated (e.g., "June 2024").'),
  topTrends: z.array(z.string()).describe('An array of the top trending topics.'),
  fastestGrowingTrend: z.string().describe('The fastest growing trend.'),
  insights: z.array(z.string()).describe('An array of key insights.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  reportMarkdown: z.string().describe('The generated markdown report.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: {schema: GenerateReportInputSchema},
  output: {schema: GenerateReportOutputSchema},
  prompt: `# 🚀 Monthly Trends Report – {{{month}}}

## 🔥 Top 5 Trending Topics
{{#each topTrends}}
1. **{{this}}**
{{/each}}

## 📈 Fastest Growing Trend
- **{{{fastestGrowingTrend}}}**

## 💡 Brief Insights
{{#each insights}}
- {{{this}}}
{{/each}}
`,
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
