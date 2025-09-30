import { create } from "zustand";
import { Message, ChatState, WorkflowData } from "../types";

interface ChatStore extends ChatState {
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  updateLastMessage: (
    content: string,
    workflows?: WorkflowData[],
    metadata?: Message["metadata"]
  ) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  error: null,

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
      ],
    })),

  updateLastMessage: (content, workflows, metadata) =>
    set((state) => {
      const messages = [...state.messages];
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        messages[messages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + content,
          ...(workflows && { workflows }),
          ...(metadata && { metadata }),
        };
      }
      return { messages };
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearMessages: () => set({ messages: [], error: null }),
}));
