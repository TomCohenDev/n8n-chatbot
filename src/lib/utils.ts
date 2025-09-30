import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extract workflow JSON from text
 * Looks for ```json code blocks
 */
export function extractWorkflowJson(text: string): string | null {
  const jsonBlockRegex = /```json\s*([\s\S]*?)```/;
  const match = text.match(jsonBlockRegex);

  if (match && match[1]) {
    return match[1].trim();
  }

  return null;
}
