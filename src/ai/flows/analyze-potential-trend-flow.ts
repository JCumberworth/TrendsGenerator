
'use server';
/**
 * @fileOverview Analyzes a single potential business idea to provide a concise analysis for business leaders, focusing on opportunity, benefits, and first steps.
 *
 * - analyzePotentialTrend - A function that analyzes a single potential business idea.
 * - AnalyzePotentialTrendInput - The input type for the analyzePotentialTrend function.
 * - AnalyzePotentialTrendOutput - The return type for the analyzePotentialTrend function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePotentialTrendInputSchema = z.object({
  trendName: z.string().describe('The name of the potential business idea or market opportunity to analyze.'),
});
export type AnalyzePotentialTrendInput = z.infer<typeof AnalyzePotentialTrendInputSchema>;

// Output will be a Markdown string with specific business-focused sections.
const AnalyzePotentialTrendOutputSchema = z.object({
  analysisMarkdown: z.string().describe('A concise Markdown-formatted analysis of the potential business idea, including Business Opportunity, Key Benefit for a business, and a suggested First Actionable Step.'),
});
export type AnalyzePotentialTrendOutput = z.infer<typeof AnalyzePotentialTrendOutputSchema>;

export async function analyzePotentialTrend(input: AnalyzePotentialTrendInput): Promise<AnalyzePotentialTrendOutput> {
  return analyzePotentialTrendFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePotentialBusinessIdeaPrompt',
  input: {schema: AnalyzePotentialTrendInputSchema},
  output: {schema: AnalyzePotentialTrendOutputSchema},
  prompt: `You are an AI business consultant. A user is interested in exploring the potential of the following business idea or market opportunity:
**Business Idea: "{{{trendName}}}"**

Based *only* on this idea name, provide a concise analysis in Markdown format, suitable for a busy business owner. Your entire response should be the Markdown content.

Your analysis should include these sections using simple, jargon-free language:

## 💡 Business Opportunity: "{{{trendName}}}"
- Briefly explain what this business idea likely involves.
- What kind of market need or problem could it solve?
- Who would be the target customer?

## ✅ Key Business Benefit:
- What is the single most significant benefit for a business pursuing this idea? (e.g., new revenue stream, cost reduction, improved customer retention, market differentiation).
- Briefly explain how this benefit is achieved.

## ➡️ First Actionable Step:
- Suggest one simple, concrete first step a business owner could take to explore this idea further or test its viability. This should be low-cost and easy to implement.

Example for "Local artisanal coffee subscription":

## 💡 Business Opportunity: "Local artisanal coffee subscription"
- This involves curating and delivering locally roasted, high-quality coffee beans to subscribers on a regular basis.
- It solves the problem of coffee lovers wanting fresh, unique coffee without the hassle of constantly sourcing it. It also supports local roasters.
- Target customers are coffee enthusiasts, people working from home, and those who appreciate local products.

## ✅ Key Business Benefit:
- **Recurring Revenue & Customer Loyalty:** A subscription model provides predictable income and builds a loyal customer base that values convenience and quality.

## ➡️ First Actionable Step:
- Partner with 1-2 local coffee roasters to create a sample offering and promote it to your existing network or on local social media groups to gauge interest.

Ensure your analysis is speculative but grounded in logical business reasoning based on the provided idea name.
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
