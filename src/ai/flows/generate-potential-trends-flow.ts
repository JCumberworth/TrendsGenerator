
'use server';
/**
 * @fileOverview Generates potential new trend ideas based on a user-provided keyword or topic.
 *
 * - generatePotentialTrends - A function that brainstorms potential trends.
 * - GeneratePotentialTrendsInput - The input type for the generatePotentialTrends function.
 * - GeneratePotentialTrendsOutput - The return type for the generatePotentialTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePotentialTrendsInputSchema = z.object({
  topicKeyword: z
    .string()
    .min(3, {message: 'Topic keyword must be at least 3 characters long.'})
    .describe('A keyword or topic phrase to brainstorm potential related trends from.'),
});
export type GeneratePotentialTrendsInput = z.infer<typeof GeneratePotentialTrendsInputSchema>;

const GeneratePotentialTrendsOutputSchema = z.object({
  potentialTrends: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe('A list of 3 to 5 distinct potential new trend ideas (names or short descriptions) related to the input keyword. Each idea should be concise and actionable.'),
});
export type GeneratePotentialTrendsOutput = z.infer<typeof GeneratePotentialTrendsOutputSchema>;

export async function generatePotentialTrends(input: GeneratePotentialTrendsInput): Promise<GeneratePotentialTrendsOutput> {
  return generatePotentialTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePotentialTrendsPrompt',
  input: {schema: GeneratePotentialTrendsInputSchema},
  output: {schema: GeneratePotentialTrendsOutputSchema},
  prompt: `You are an AI assistant specialized in identifying emerging trends.
Given the following topic or keyword: {{{topicKeyword}}}

Brainstorm and list 3 to 5 distinct potential new trend ideas.
These ideas should be concise (a short phrase or name).
Focus on novelty and plausibility for future growth.
Avoid generic suggestions; aim for specific and insightful ideas.
Return your answer as a list of strings under the 'potentialTrends' key.
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
