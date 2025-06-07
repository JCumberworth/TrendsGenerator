
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Validate that the API key is available
const apiKey = process.env.GOOGLE_GENAI_API_KEY;
if (!apiKey) {
  throw new Error('GOOGLE_GENAI_API_KEY environment variable is required');
}

export const ai = genkit({
  plugins: [googleAI({ apiKey })],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
