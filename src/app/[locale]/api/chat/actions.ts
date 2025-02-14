"use server";

import { db } from "@/lib/db";
import OpenAI from "openai";
import { getCurrentUser } from "../auth/actions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a helpful cybersecurity assistant for Cyna, a company that provides enterprise security solutions. 
Your main services are:
1. SOC as a Service ($2,999/month)
2. EDR Protection ($15/endpoint/month)
3. XDR Platform ($4,999/month)

Be friendly and professional. Keep responses concise but informative. If asked about pricing or services, provide accurate information from the list above.
For technical questions, provide accurate but easy-to-understand explanations.`;

export async function createConversation() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    const conversation = await db
      .insertInto("chat_conversations")
      .values({
        user_id: user.id,
        title: "New Conversation",
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return { conversation };
  } catch (error) {
    console.error("Error creating conversation:", error);
    return { error: "Failed to create conversation" };
  }
}

export async function sendMessage(conversationId: string, message: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    // Save user message
    await db
      .insertInto("chat_messages")
      .values({
        conversation_id: conversationId,
        role: "user",
        content: message,
      })
      .execute();

    // Get conversation history
    const history = await db
      .selectFrom("chat_messages")
      .where("conversation_id", "=", conversationId)
      .orderBy("created_at", "asc")
      .selectAll()
      .execute();

    // Prepare messages for OpenAI
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;

    // Save AI response
    await db
      .insertInto("chat_messages")
      .values({
        conversation_id: conversationId,
        role: "assistant",
        content: aiResponse,
      })
      .execute();

    return {
      message: aiResponse,
      history: [
        ...history,
        {
          role: "assistant",
          content: aiResponse,
          created_at: new Date(),
        },
      ],
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: "Failed to send message" };
  }
}

export async function getConversationHistory(conversationId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    const messages = await db
      .selectFrom("chat_messages")
      .where("conversation_id", "=", conversationId)
      .orderBy("created_at", "asc")
      .selectAll()
      .execute();

    return { messages };
  } catch (error) {
    console.error("Error fetching conversation history:", error);
    return { error: "Failed to fetch conversation history" };
  }
}
