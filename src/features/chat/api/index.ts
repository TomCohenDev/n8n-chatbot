import { N8N_WEBHOOK_URL } from "@/lib/constants";
import { WorkflowData } from "../types";

export interface SendMessageRequest {
  message: string;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface SendMessageResponse {
  response: string;
  workflows?: WorkflowData[];
  metadata?: {
    hasWorkflows: boolean;
    workflowCount: number;
    requiresCredentials: string[];
  };
}

/**
 * Send a message to the n8n webhook and handle structured response
 */
export async function sendMessage(
  request: SendMessageRequest,
  onChunk?: (text: string) => void,
  onComplete?: (
    workflows?: WorkflowData[],
    metadata?: SendMessageResponse["metadata"]
  ) => void
): Promise<SendMessageResponse> {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Stream the message content
    if (onChunk && data.message) {
      onChunk(data.message);
    }

    // Pass workflows to callback
    if (onComplete && data.workflows) {
      onComplete(data.workflows, data.metadata);
    }

    return {
      response: data.message || "",
      workflows: data.workflows,
      metadata: data.metadata,
    };
  } catch (error) {
    console.error("Error sending message to n8n webhook:", error);
    throw error;
  }
}
