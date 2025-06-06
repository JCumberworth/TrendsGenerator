import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GeneratePotentialTrendsInputSchema = z.object({
  topicKeyword: z.string().describe('A keyword or business area to generate potential business ideas for'),
});

const GeneratePotentialTrendsOutputSchema = z.object({
  potentialTrends: z.array(z.string()).describe('An array of potential business ideas or trends'),
});

export type GeneratePotentialTrendsInput = z.infer<typeof GeneratePotentialTrendsInputSchema>;
export type GeneratePotentialTrendsOutput = z.infer<typeof GeneratePotentialTrendsOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generatePotentialBusinessIdeasPrompt',
  input: {schema: GeneratePotentialTrendsInputSchema},
  output: {schema: GeneratePotentialTrendsOutputSchema},
  prompt: `You are an AI assistant specialized in identifying emerging business opportunities and market niches for entrepreneurs and business leaders.
Given the following topic or keyword: {{{topicKeyword}}}

Brainstorm and list 3 to 5 distinct potential new business ideas or market opportunities.
These ideas should be concise (a short phrase or name representing a business concept).
Focus on practical applicability, potential for profitability, and relevance to current market needs.
Avoid overly technical jargon. Aim for ideas that a business owner could readily understand and consider.
Return your answer as a list of strings under the 'potentialTrends' key.

Example ideas for 'sustainable retail':
- "Subscription box for eco-friendly home products"
- "Local repair and upcycling workshop for clothing"
- "Consulting service for small retailers transitioning to sustainable packaging"
`,
});

const generatePotentialTrendsFlow = ai.defineFlow(
  {
    name: 'generatePotentialTrendsFlow',
    inputSchema: GeneratePotentialTrendsInputSchema,
    outputSchema: GeneratePotentialTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generatePotentialTrends(input: GeneratePotentialTrendsInput): Promise<GeneratePotentialTrendsOutput> {
  return generatePotentialTrendsFlow(input);
}