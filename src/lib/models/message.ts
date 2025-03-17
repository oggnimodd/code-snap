export type MessageType =
  | "USER_CHAT"
  | "ASSISTANT_CHAT"
  | "ERROR_CHAT"
  | "SYSTEM_PROMPT";

export interface Message {
  id: string;
  type: MessageType;
  content: string[];
  version?: number;
}
