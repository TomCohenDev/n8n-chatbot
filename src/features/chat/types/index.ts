export type MessageRole = "user" | "assistant";

export interface WorkflowData {
  name: string;
  description: string;
  json: Record<string, unknown>;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  workflows?: WorkflowData[]; // Array of structured workflows
  metadata?: {
    hasWorkflows: boolean;
    workflowCount: number;
    requiresCredentials: string[];
  };
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
