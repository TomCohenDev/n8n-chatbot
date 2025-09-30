"use client";

import { Message } from "@/features/chat/types";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { WorkflowCard } from "../workflow/workflow-card";
import { Badge } from "@/components/ui/badge";
import { FileJson } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const hasWorkflows = message.workflows && message.workflows.length > 0;

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn("max-w-[80%]", isUser ? "" : "w-full")}>
        <div
          className={cn(
            "rounded-lg px-4 py-3",
            isUser
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          )}
        >
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {isUser ? (
              <p className="m-0 whitespace-pre-wrap">{message.content}</p>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code(props) {
                    const { children, className, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || "");
                    const codeString = String(children).replace(/\n$/, "");
                    const isInline = !className;

                    return !isInline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...rest}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>

          <div
            className={cn(
              "text-xs mt-2 flex items-center gap-2",
              isUser ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
            )}
          >
            <span>{message.timestamp.toLocaleTimeString()}</span>
            {hasWorkflows && (
              <Badge variant="secondary" className="text-xs">
                <FileJson className="h-3 w-3 mr-1" />
                {message.workflows!.length} workflow
                {message.workflows!.length > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>

        {/* Display workflows */}
        {hasWorkflows && (
          <div className="mt-2 space-y-2">
            {message.workflows!.map((workflow, index) => (
              <WorkflowCard key={index} workflow={workflow} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
