import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from './constants';
import { SYSTEM_PROMPT } from './prompts';

export const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

export interface StreamChatOptions {
  message: string;
  onChunk?: (text: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Stream a chat completion from Claude
 */
export async function streamChat(options: StreamChatOptions) {
  const { message, onChunk, onComplete, onError } = options;

  try {
    const stream = await anthropic.messages.stream({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    let fullText = '';

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        const text = chunk.delta.text;
        fullText += text;
        onChunk?.(text);
      }
    }

    onComplete?.(fullText);
    return fullText;
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    onError?.(err);
    throw err;
  }
}

/**
 * Extract workflow JSON from Claude's response
 * Looks for ```json code blocks
 */
export function extractWorkflowJson(text: string): string | null {
  const jsonBlockRegex = /```json\s*([\s\S]*?)```/;
  const match = text.match(jsonBlockRegex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  return null;
}
