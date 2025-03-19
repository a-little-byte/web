import type { CreatedAt, UpdatedAt } from "@/db/utils";
import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import type { UUID } from "node:crypto";

export type ChatConversation = {
  id: Generated<UUID>;
  user_id: UUID;
  title: string;
  created_at: CreatedAt;
  updated_at: UpdatedAt;
};

export type ChatConversationSelect = Selectable<ChatConversation>;
export type ChatConversationInsert = Insertable<ChatConversation>;
export type ChatConversationUpdate = Updateable<ChatConversation>;

export type ChatMessage = {
  id: Generated<UUID>;
  conversation_id: UUID;
  role: string;
  content: string;
  created_at: CreatedAt;
};

export type ChatMessageSelect = Selectable<ChatMessage>;
export type ChatMessageInsert = Insertable<ChatMessage>;
export type ChatMessageUpdate = Updateable<ChatMessage>;
