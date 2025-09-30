import { ChatContainer } from "@/components/chat/chat-container";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto max-w-5xl h-screen py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            n8n Chat Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered assistant for creating n8n workflows
          </p>
        </div>
        
        <Card className="h-[calc(100vh-200px)] flex flex-col shadow-xl">
          <ChatContainer />
        </Card>
      </div>
    </div>
  );
}
