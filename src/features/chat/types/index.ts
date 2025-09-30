export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  workflowJson?: string; // Extracted workflow JSON if present
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ParsedWorkflow {
  json: string;
  startIndex: number;
  endIndex: number;
}
