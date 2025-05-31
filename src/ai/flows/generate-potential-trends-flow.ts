
'use server';
/**
 * @fileOverview Generates potential new business ideas or market opportunities based on a user-provided keyword or topic, tailored for business leaders.
 *
 * - generatePotentialTrends - A function that brainstorms potential business ideas.
 * - GeneratePotentialTrendsInput - The input type for the generatePotentialTrends function.
 * - GeneratePotentialTrendsOutput - The return type for the generatePotentialTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePotentialTrendsInputSchema = z.object({
  topicKeyword: z
    .string()
    .min(3, {message: 'Topic keyword must be at least 3 characters long.'})
    .describe('A keyword or business area (e.g., "sustainable retail", "employee engagement", "local tourism") to brainstorm potential new business ideas or market opportunities from.'),
});
export type GeneratePotentialTrendsInput = z.infer<typeof GeneratePotentialTrendsInputSchema>;

const GeneratePotentialTrendsOutputSchema = z.object({
  potentialTrends: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe('A list of 3 to 5 distinct potential new business ideas or market opportunities (concise names or short descriptions) related to the input keyword. Each idea should sound like a tangible business concept.'),
});
export type GeneratePotentialTrendsOutput = z.infer<typeof GeneratePotentialTrendsOutputSchema>;

export async function generatePotentialTrends(input: GeneratePotentialTrendsInput): Promise<GeneratePotentialTrendsOutput> {
  return generatePotentialTrendsFlow(input);
}

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
