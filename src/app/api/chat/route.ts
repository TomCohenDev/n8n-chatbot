import { NextRequest } from 'next/server';
import { streamChat } from '@/lib/claude';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return new Response('Message is required', { status: 400 });
    }

    // Create a ReadableStream for streaming the response
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await streamChat({
            message,
            onChunk: (text) => {
              controller.enqueue(encoder.encode(text));
            },
            onComplete: () => {
              controller.close();
            },
            onError: (error) => {
              console.error('Streaming error:', error);
              controller.error(error);
            },
          });
        } catch (error) {
          console.error('Stream start error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
