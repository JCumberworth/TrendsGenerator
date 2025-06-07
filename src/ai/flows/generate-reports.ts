
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateReportInputSchema = z.object({
  month: z.string().describe('The month for which to generate the report'),
  analysisMarkdown: z.string().describe('The analysis markdown content to include in the report'),
});

const GenerateReportOutputSchema = z.object({
  reportMarkdown: z.string().describe('The complete monthly report in markdown format'),
});

type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;
type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `You are a business intelligence report writer. Create a comprehensive monthly business trends report for ${input.month}.

Use the following analysis as the foundation for your report:
${input.analysisMarkdown}

Structure the report with the following sections:

# 📊 Monthly Business Trends Report - ${input.month}

## Executive Summary
- 3-4 key highlights from the month
- Major market movements and their implications
- Overall business climate assessment

## Top Trending Topics
- Extract and summarize the most significant trends
- Explain why each trend matters for businesses
- Include specific examples and data points where available

## Industry Insights
- Sector-specific trends and developments
- Cross-industry patterns and connections
- Emerging technologies and their business impact

## Actionable Recommendations
- Specific steps businesses can take this month
- Quick wins and low-hanging fruit opportunities
- Medium-term strategic considerations

## Market Outlook
- What to watch for in the coming month
- Potential opportunities and threats
- Key metrics to monitor

## Resources & Next Steps
- Relevant tools, platforms, or services mentioned
- Further reading or research recommendations
- Implementation guidance

Make the report professional yet accessible, with specific actionable insights that small to medium business owners can implement. Include relevant emojis to make it engaging while maintaining professionalism.`,
    });

    return {
      reportMarkdown: llmResponse.text,
    };
  }
);

export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}
