import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AnalyzePotentialTrendInputSchema = z.object({
  trendName: z.string().describe('The name of the potential business trend to analyze'),
});

const AnalyzePotentialTrendOutputSchema = z.object({
  analysisMarkdown: z.string().describe('Detailed markdown analysis of the potential business trend including market opportunity, target audience, implementation steps, potential challenges, and success metrics'),
});

type AnalyzePotentialTrendInput = z.infer<typeof AnalyzePotentialTrendInputSchema>;
type AnalyzePotentialTrendOutput = z.infer<typeof AnalyzePotentialTrendOutputSchema>;

const analyzePotentialTrendFlow = ai.defineFlow(
  {
    name: 'analyzePotentialTrendFlow',
    inputSchema: AnalyzePotentialTrendInputSchema,
    outputSchema: AnalyzePotentialTrendOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `You are a business analyst expert. Analyze the following potential business trend: "${input.trendName}"

Please provide a comprehensive analysis in markdown format that includes:

## Market Opportunity
- Current market size and growth potential
- Key drivers behind this trend
- Market gaps this trend addresses

## Target Audience
- Primary customer segments
- Demographics and psychographics
- Customer pain points addressed

## Implementation Strategy
- Key steps to capitalize on this trend
- Required resources and capabilities
- Timeline considerations

## Potential Challenges
- Market barriers and risks
- Competition analysis
- Regulatory considerations

## Success Metrics
- KPIs to track
- Financial projections
- Milestones to measure progress

## Actionable Next Steps
- Immediate actions to take
- Medium-term strategic moves
- Long-term vision

Provide specific, actionable insights rather than generic advice. Focus on practical business implementation.`,
    });

    return {
      analysisMarkdown: llmResponse.text(),
    };
  }
);

export async function analyzePotentialTrend(input: AnalyzePotentialTrendInput): Promise<AnalyzePotentialTrendOutput> {
  return analyzePotentialTrendFlow(input);
}