
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateProjectOutlineInputSchema = z.object({
  trendName: z.string().describe('The name of the business trend'),
  analysisMarkdown: z.string().describe('The existing analysis of the trend'),
  editPrompt: z.string().optional().describe('User prompt for editing the project outline'),
});

const GenerateProjectOutlineOutputSchema = z.object({
  targetAudience: z.string().describe('Identified target audience for this business idea'),
  projectOutline: z.string().describe('Detailed project outline for implementing this idea on Replit'),
});

export type GenerateProjectOutlineInput = z.infer<typeof GenerateProjectOutlineInputSchema>;
export type GenerateProjectOutlineOutput = z.infer<typeof GenerateProjectOutlineOutputSchema>;

const generateProjectOutlineFlow = ai.defineFlow(
  {
    name: 'generateProjectOutlineFlow',
    inputSchema: GenerateProjectOutlineInputSchema,
    outputSchema: GenerateProjectOutlineOutputSchema,
  },
  async (input) => {
    let prompt = `You are a technical project manager and business analyst. Based on the business idea "${input.trendName}" and its analysis, provide:

1. TARGET AUDIENCE identification
2. A detailed REPLIT PROJECT OUTLINE for building an MVP

Analysis:
${input.analysisMarkdown}`;

    // If an edit prompt is provided, include it in the prompt to the AI
    if (input.editPrompt) {
      prompt += `\n\nUser Revision Request: ${input.editPrompt}\n\nPlease revise the project outline based on this feedback while maintaining the same structure.`;
    }

    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt

Please provide your response in two sections:

## Target Audience
Identify the specific industry, user types, demographics, and characteristics of the primary target audience for "${input.trendName}". Be specific about who would benefit most from this business idea.

## Replit Project Outline
Create a comprehensive technical project outline for building an MVP of "${input.trendName}" on Replit. Include:

### Project Overview
- Brief description of what will be built
- Core value proposition
- Key features to implement

### Technology Stack
- Recommended framework (React, Next.js, Python Flask, etc.)
- Database solution (if needed)
- APIs and integrations required
- UI/UX considerations

### Development Phases
#### Phase 1: Foundation (Week 1)
- Basic project setup
- Core functionality
- Initial UI/UX

#### Phase 2: Features (Week 2-3)
- Key feature implementation
- Data handling
- User interactions

#### Phase 3: Polish (Week 4)
- Testing and debugging
- UI improvements
- Deployment preparation

### Key Features to Build
- List 5-7 specific features to implement
- Prioritize by importance (Must-have vs Nice-to-have)

### Success Metrics
- How to measure if the MVP is successful
- Key performance indicators

### Deployment Strategy
- How to deploy on Replit
- Considerations for scaling

Keep the outline practical and achievable for a solo developer or small team working on Replit.`,
    });

    // Parse the response to extract target audience and project outline
    const responseText = llmResponse.text;
    const targetAudienceMatch = responseText.match(/## Target Audience\n([\s\S]*?)(?=\n## |$)/);
    const projectOutlineMatch = responseText.match(/## Replit Project Outline\n([\s\S]*)/);

    return {
      targetAudience: targetAudienceMatch ? targetAudienceMatch[1].trim() : responseText.substring(0, 500),
      projectOutline: projectOutlineMatch ? projectOutlineMatch[1].trim() : responseText.substring(500),
    };
  }
);

export async function generateProjectOutline(input: GenerateProjectOutlineInput): Promise<GenerateProjectOutlineOutput> {
  return generateProjectOutlineFlow(input);
}
