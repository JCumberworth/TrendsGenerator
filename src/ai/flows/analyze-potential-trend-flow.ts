
'use server';
/**
 * @fileOverview Analyzes a single potential business idea or market opportunity to provide a comprehensive, actionable analysis for business leaders.
 * This simulates a "deep dive" as if researching across multiple platforms, focusing on opportunity, target market, challenges, and concrete first steps.
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
  analysisMarkdown: z.string().describe('A comprehensive Markdown-formatted analysis of the potential business idea. It should include sections for Business Opportunity, Target Audience, Key Benefits, Potential Challenges, and a detailed list of 3-5 Actionable First Steps to explore or validate the idea.'),
});
export type AnalyzePotentialTrendOutput = z.infer<typeof AnalyzePotentialTrendOutputSchema>;

export async function analyzePotentialTrend(input: AnalyzePotentialTrendInput): Promise<AnalyzePotentialTrendOutput> {
  return analyzePotentialTrendFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePotentialBusinessIdeaDeepDivePrompt',
  input: {schema: AnalyzePotentialTrendInputSchema},
  output: {schema: AnalyzePotentialTrendOutputSchema},
  prompt: `You are an AI business consultant providing a "deep dive" analysis for a business leader exploring the potential of the following business idea or market opportunity:
**Business Idea: "{{{trendName}}}"**

Based *only* on this idea name, provide a comprehensive and actionable analysis in Markdown format, suitable for a busy business owner. Assume you have researched this topic across various platforms (like Reddit for sentiment, YouTube for explanations, news sites for market context). Your entire response should be the Markdown content.

Your analysis should include these sections using simple, jargon-free language:

## 💡 Business Opportunity: "{{{trendName}}}"
- What specific problem does this idea solve for customers?
- What is the unique value proposition? How is it different or better than existing solutions?
- What are the potential revenue streams (e.g., direct sales, subscription, service fees)?
- Briefly touch upon the market size or growth potential if you can reasonably infer it.

## 🎯 Target Audience:
- Who are the primary customers or customer segments for this idea? Be specific (e.g., "small e-commerce businesses needing affordable marketing," not just "businesses").
- What are their key needs, pain points, or desires that this idea addresses?

## ✅ Key Business Benefits:
- List 2-3 significant benefits for a business pursuing this idea (e.g., new revenue stream, cost reduction, market differentiation, improved customer retention, access to new markets).
- For each benefit, briefly explain how it is achieved.

## ⚠️ Potential Challenges & Risks:
- What are 1-2 major challenges or risks a business might face when pursuing this idea? (e.g., high competition, technological hurdles, regulatory issues, marketing difficulties).
- Briefly suggest a mitigation strategy or consideration for each challenge.

## 🚀 Actionable First Steps (3-5 Steps):
Provide a list of 3 to 5 concrete, practical, and low-cost first steps a business owner could take to explore this idea further, validate its viability, or start building a minimum viable product (MVP).
These steps should be sequential if possible.
1. **[Step 1: e.g., Conduct competitor research on 3 existing players]** - Brief explanation of what to do.
2. **[Step 2: e.g., Survey 10-15 potential customers about their needs]** - Brief explanation.
3. **[Step 3: e.g., Create a simple landing page outlining the offering to gauge interest]** - Brief explanation.
4. **[Step 4 (Optional): e.g., Develop a basic prototype or service outline]** - Brief explanation.
5. **[Step 5 (Optional): e.g., Identify one key partner or supplier]** - Brief explanation.

Example for "AI-Powered Local Food Delivery Matching Service":

## 💡 Business Opportunity: "AI-Powered Local Food Delivery Matching Service"
- Solves the problem of consumers finding diverse, high-quality local food options quickly, and small restaurants struggling with delivery logistics or high commission fees from existing platforms.
- Unique value: AI matches users to restaurants based on nuanced preferences (diet, cuisine style, past orders, time of day) and optimizes delivery routes for aggregated orders from smaller restaurants.
- Revenue: Small commission per order, premium features for restaurants (e.g., enhanced visibility).
- Market: Growing demand for food delivery and niche local eateries.

## 🎯 Target Audience:
- Primary: Busy professionals, families seeking varied meal options, foodies interested in local/artisan restaurants.
- Secondary: Small, independent restaurants lacking their own delivery infrastructure or wanting fairer commission structures.
- Needs: Convenience, variety, quality, supporting local businesses (for consumers); increased orders, lower delivery costs, fair platform terms (for restaurants).

## ✅ Key Business Benefits:
- **New Revenue Stream & Market Access:** Connects local restaurants to a wider customer base, increasing their sales potential.
- **Improved Efficiency & Cost Savings (for restaurants):** AI-optimized routing can reduce delivery costs if managing a shared pool of drivers.
- **Enhanced Customer Experience (for consumers):** More relevant recommendations and potentially faster/cheaper delivery from local favorites.

## ⚠️ Potential Challenges & Risks:
- **Competition:** Highly competitive market with established players (e.g., DoorDash, Uber Eats). Mitigation: Focus on a niche (e.g., hyper-local, specific cuisine types) or a unique value proposition (e.g., significantly lower commissions for restaurants).
- **Logistics Complexity:** Managing delivery drivers and ensuring food quality during transit. Mitigation: Start with a small, defined delivery zone and potentially partner with existing local delivery services initially.

## 🚀 Actionable First Steps (3-5 Steps):
1. **Validate Restaurant Interest:** Speak to 5-10 local restaurant owners to understand their current delivery pain points and receptiveness to a new platform with your proposed benefits (e.g., AI matching, potentially lower fees).
2. **Survey Potential Users:** Create a short online survey for 50-100 local residents to gauge their interest in an AI-powered food matching service and what features they'd value most.
3. **Map Local Food Scene & Competitors:** Identify all local restaurants in a target neighborhood and analyze what delivery services they currently use and their pricing.
4. **Develop a Basic Matching Algorithm Concept:** Outline on paper how the AI would match users to restaurants based on 3-4 key criteria (e.g., cuisine preference, price range, past ratings, delivery time). This is conceptual, not coding.
5. **Create a Mockup/Landing Page:** Design a simple landing page or a few app screen mockups explaining the service and include a sign-up form for early access/updates to measure initial consumer interest.

Ensure your analysis is speculative but grounded in logical business reasoning based on the provided idea name, as if drawing from broad market knowledge.
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
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AnalyzePotentialTrendInputSchema = z.object({
  trendName: z.string().describe('The name of the potential business trend to analyze'),
});

const AnalyzePotentialTrendOutputSchema = z.object({
  analysisMarkdown: z.string().describe('Detailed markdown analysis of the potential business trend including market opportunity, target audience, implementation steps, potential challenges, and success metrics'),
});

export type AnalyzePotentialTrendInput = z.infer<typeof AnalyzePotentialTrendInputSchema>;
export type AnalyzePotentialTrendOutput = z.infer<typeof AnalyzePotentialTrendOutputSchema>;

const analyzePotentialTrendPrompt = ai.definePrompt({
  name: 'analyzePotentialTrendPrompt',
  input: {schema: AnalyzePotentialTrendInputSchema},
  output: {schema: AnalyzePotentialTrendOutputSchema},
  prompt: `You are an AI business analyst providing detailed analysis of potential business opportunities. 

Analyze the following business idea: {{{trendName}}}

Provide a comprehensive analysis in Markdown format that includes:

## 🎯 **Market Opportunity**
- Market size and potential
- Current demand indicators
- Growth trends and projections

## 👥 **Target Audience**
- Primary customer segments
- Customer pain points this solves
- Customer acquisition strategies

## 🚀 **Implementation Steps**
- Key steps to launch this business
- Required resources and investments
- Timeline considerations

## ⚠️ **Potential Challenges**
- Market competition analysis
- Regulatory or legal considerations  
- Technical or operational hurdles

## 📊 **Success Metrics**
- Key performance indicators to track
- Revenue potential and pricing models
- Scalability factors

## 💡 **Recommendations**
- Strategic advice for execution
- Risk mitigation strategies
- Next steps for validation

Keep the analysis practical, actionable, and focused on helping business owners make informed decisions.`,
});

const analyzePotentialTrendFlow = ai.defineFlow(
  {
    name: 'analyzePotentialTrendFlow',
    inputSchema: AnalyzePotentialTrendInputSchema,
    outputSchema: AnalyzePotentialTrendOutputSchema,
  },
  async input => {
    const {output} = await analyzePotentialTrendPrompt(input);
    return output!;
  }
);

export async function analyzePotentialTrend(input: AnalyzePotentialTrendInput): Promise<AnalyzePotentialTrendOutput> {
  return analyzePotentialTrendFlow(input);
}
