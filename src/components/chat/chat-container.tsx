'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/features/chat/store';
import { MessageBubble } from './message-bubble';
import { ChatInput } from './chat-input';
import { sendMessage } from '@/features/chat/api';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

export function ChatContainer() {
  const { messages, isLoading, addMessage, updateLastMessage, setLoading, setError } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    addMessage({ role: 'user', content });

    // Add empty assistant message that will be updated with streaming
    addMessage({ role: 'assistant', content: '' });
    setLoading(true);
    setError(null);

    try {
      await sendMessage(
        { message: content },
        (chunk) => {
          // Update the last message with each chunk
          updateLastMessage(chunk);
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Welcome to n8n Chat Assistant</h2>
              <p>Ask me to create workflows, and I&apos;ll generate n8n workflow JSON for you!</p>
              <div className="mt-6 text-left max-w-md mx-auto">
                <p className="font-semibold mb-2">Try asking:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>&quot;Create a webhook that sends data to Slack&quot;</li>
                  <li>&quot;Make a workflow that processes JSON data&quot;</li>
                  <li>&quot;Build a workflow to send emails via Gmail&quot;</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500 ml-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input area */}
      <div className="border-t p-4 bg-white dark:bg-gray-950">
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
