import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import type { AIProvider } from '@/lib/types';

// Provider factory functions
export function createAIProvider(providerId: AIProvider, apiKey: string) {
  switch (providerId) {
    case 'groq':
      return createOpenAI({
        apiKey,
        baseURL: 'https://api.groq.com/openai/v1',
      });

    case 'google':
      return createGoogleGenerativeAI({
        apiKey,
      });

    case 'cerebras':
      return createOpenAI({
        apiKey,
        baseURL: 'https://api.cerebras.ai/v1',
      });

    case 'together':
      return createOpenAI({
        apiKey,
        baseURL: 'https://api.together.xyz/v1',
      });

    case 'mistral':
      return createOpenAI({
        apiKey,
        baseURL: 'https://api.mistral.ai/v1',
      });

    case 'openai':
      return createOpenAI({
        apiKey,
      });

    default:
      throw new Error(`Unknown provider: ${providerId}`);
  }
}

// Get model ID for specific providers
export function getModelId(providerId: AIProvider, modelName: string): string {
  switch (providerId) {
    case 'google':
      return modelName;
    default:
      return modelName;
  }
}

// System prompts for different modes
export const MODE_PROMPTS = {
  chat: `You are MiniMinds, a helpful AI assistant. Be concise, accurate, and helpful.`,

  code: `You are MiniMinds Code, an expert programming assistant. You can:
- Write, explain, and debug code in any language
- Create full-stack applications
- Set up databases, APIs, and authentication
- Deploy applications
- Write tests and documentation

When writing code:
- Use modern best practices
- Include comments for complex logic
- Handle errors appropriately
- Consider security and performance

Format code blocks with the appropriate language tag.`,

  ppt: `You are MiniMinds PPT, a presentation creation assistant. You can:
- Create professional presentations
- Design slide layouts
- Write compelling content
- Suggest visual elements

When creating presentations:
- Keep slides concise (max 6 bullet points)
- Use clear, impactful titles
- Suggest appropriate images or charts
- Maintain consistent styling`,

  research: `You are MiniMinds Research, a deep research assistant. You can:
- Search and analyze information from multiple sources
- Synthesize complex topics
- Create comprehensive reports
- Generate citations and references

When researching:
- Verify information from multiple sources
- Present balanced perspectives
- Cite sources when possible
- Highlight key findings`,

  multimodal: `You are MiniMinds Multimodal, an AI that can process and generate multiple types of content. You can:
- Analyze images, audio, and video
- Generate images and audio
- Process documents and files
- Create multimedia content

Describe any visual or audio content clearly and accurately.`,
};
