import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AnalyzeTrendsInputSchema = z.object({
  trendData: z.string().describe('Raw trend data to analyze'),
});

const AnalyzeTrendsOutputSchema = z.object({
  analysisMarkdown: z.string().describe('Comprehensive markdown analysis of the trend data'),
});

type AnalyzeTrendsInput = z.infer<typeof AnalyzeTrendsInputSchema>;
type AnalyzeTrendsOutput = z.infer<typeof AnalyzeTrendsOutputSchema>;

const analyzeTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeTrendsFlow',
    inputSchema: AnalyzeTrendsInputSchema,
    outputSchema: AnalyzeTrendsOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `You are a business intelligence analyst. Analyze the following trend data and provide actionable insights for business decision-makers.

Trend Data:
${input.trendData}

Please provide a comprehensive analysis in markdown format that includes:

## Executive Summary
- Key findings and main takeaways
- Overall trend trajectory and significance

## Detailed Analysis
- Breakdown of individual trends
- Patterns and correlations identified
- Market implications

## Business Opportunities
- Specific opportunities for different business types
- Market gaps and unmet needs
- Potential revenue streams

## Risk Assessment
- Potential challenges and threats
- Market volatility factors
- Competitive landscape considerations

## Strategic Recommendations
- Short-term tactical moves
- Long-term strategic positioning
- Resource allocation suggestions

## Implementation Timeline
- Immediate actions (next 30 days)
- Medium-term goals (3-6 months)
- Long-term objectives (6-12 months)

Focus on actionable insights that business owners can implement. Be specific and practical in your recommendations.`,
    });

    return {
      analysisMarkdown: llmResponse.text(),
    };
  }
);

export async function analyzeTrends(input: AnalyzeTrendsInput): Promise<AnalyzeTrendsOutput> {
  return analyzeTrendsFlow(input);
}