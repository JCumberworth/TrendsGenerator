
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GeneratePotentialTrendsInputSchema = z.object({
  topicKeyword: z.string().describe('The topic keyword to generate potential business trends for'),
});

const GeneratePotentialTrendsOutputSchema = z.object({
  potentialTrends: z.array(z.string()).describe('Array of potential business trend names related to the topic keyword'),
});

type GeneratePotentialTrendsInput = z.infer<typeof GeneratePotentialTrendsInputSchema>;
type GeneratePotentialTrendsOutput = z.infer<typeof GeneratePotentialTrendsOutputSchema>;

const generatePotentialTrendsFlow = ai.defineFlow(
  {
    name: 'generatePotentialTrendsFlow',
    inputSchema: GeneratePotentialTrendsInputSchema,
    outputSchema: GeneratePotentialTrendsOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `You are a business trends expert. Based on the keyword "${input.topicKeyword}", generate 5-7 specific, actionable business trend ideas that entrepreneurs and small business owners could potentially capitalize on.

Each trend should be:
- Specific and focused (not too broad)
- Relevant to current market conditions
- Implementable by small to medium businesses
- Connected to the keyword "${input.topicKeyword}"

Format your response as a simple list, one trend per line, without bullets or numbers. Focus on emerging opportunities, technological innovations, consumer behavior shifts, or market gaps related to ${input.topicKeyword}.

Example format:
AI-Powered Customer Service for Local Restaurants
Sustainable Packaging Solutions for E-commerce
Remote Team Collaboration Tools for Creative Agencies

Now generate trends for: ${input.topicKeyword}`,
    });

    // Split the response into individual trends and clean them up
    const trends = llmResponse.text()
      .split('\n')
      .map(trend => trend.trim())
      .filter(trend => trend.length > 0 && !trend.startsWith('-') && !trend.match(/^\d+\./))
      .slice(0, 7); // Limit to 7 trends max

    return {
      potentialTrends: trends,
    };
  }
);

export async function generatePotentialTrends(input: GeneratePotentialTrendsInput): Promise<GeneratePotentialTrendsOutput> {
  return generatePotentialTrendsFlow(input);
}
