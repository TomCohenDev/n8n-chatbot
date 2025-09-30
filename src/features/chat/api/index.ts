export interface SendMessageRequest {
  message: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface SendMessageResponse {
  response: string;
  workflowJson?: string;
}

/**
 * Send a message to the chat API with streaming support
 */
export async function sendMessage(
  request: SendMessageRequest,
  onChunk?: (text: string) => void
): Promise<SendMessageResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    if (!reader) {
      throw new Error('No response body');
    }

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;
      onChunk?.(chunk);
    }

    return {
      response: fullResponse,
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
