'use client';

import { Message } from '@/features/chat/types';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { WorkflowActions } from '../workflow/workflow-actions';
import { extractWorkflowJson } from '@/lib/claude';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const workflowJson = extractWorkflowJson(message.content);

  return (
    <div
      className={cn(
        'flex w-full mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-3',
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {isUser ? (
            <p className="m-0 whitespace-pre-wrap">{message.content}</p>
          ) : (
            <>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const code = String(children).replace(/\n$/, '');
                    
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {code}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
              {workflowJson && (
                <div className="mt-4">
                  <WorkflowActions workflowJson={workflowJson} />
                </div>
              )}
            </>
          )}
        </div>
        <div className={cn(
          'text-xs mt-2',
          isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
        )}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
