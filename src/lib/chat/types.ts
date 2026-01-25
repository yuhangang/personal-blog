import { z } from "zod";
import { CHAT_ACTIONS } from "../../config/chat-actions";

// -- Types --

export type MessageRole = "user" | "model" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  attachments?: {
    type: "image" | "link";
    url: string; // For images: data:image/...; base64,... or https...
    metadata?: any;
  }[];
  timestamp: number;
}

export interface PipelineResult {
  success: boolean;
  action?: {
    id: string;
    params: any;
  };
  response?: string; // Text response from model
  error?: string;
}

// -- Helpers --

// Helper to validate parameters against our Zod schemas
export function validateActionParams(actionId: string, params: any) {
  const actionKey = Object.keys(CHAT_ACTIONS).find(
    (key) => CHAT_ACTIONS[key as keyof typeof CHAT_ACTIONS].id === actionId,
  );

  if (!actionKey) {
    throw new Error(`Unknown action ID: ${actionId}`);
  }

  const action = CHAT_ACTIONS[actionKey as keyof typeof CHAT_ACTIONS];
  return action.parameters.parse(params);
}
