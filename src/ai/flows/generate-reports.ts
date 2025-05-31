'use server';

/**
 * @fileOverview Generates monthly business trend snapshot reports in Markdown format using pre-analyzed insights tailored for business leaders.
 *
 * - generateReport - A function to generate the business-focused report.
 * - GenerateReportInput - The input type for the generateReport function.
 * - GenerateReportOutput - The return type for the generateReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportInputSchema = z.object({
  month: z.string().describe('The month for which the report is generated (e.g., "July 2024").'),
  analysisMarkdown: z.string().describe('The AI-generated analysis of business trends in Markdown format, already structured with Top 3 Trends, Why it Matters, Simple Actions, Quick Wins, and Additional Resources.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  reportMarkdown: z.string().describe('The generated complete monthly business trends snapshot in Markdown format, max 1-2 pages.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

// The analysisMarkdown should already contain the full content structure needed.
// This prompt just wraps it with the main report title and month.
const prompt = ai.definePrompt({
  name: 'generateBusinessReportPrompt',
  input: {schema: GenerateReportInputSchema},
  output: {schema: GenerateReportOutputSchema},
  prompt: `# 📊 **Monthly Business Trends Snapshot** – {{{month}}}

{{{analysisMarkdown}}}
`,
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async input => {
    // The analysisMarkdown from analyze-trends.ts should already be in the desired report format.
    // This flow mainly just titles it for the specific month.
    const {output} = await prompt(input);
    return output!;
  }
);
