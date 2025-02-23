"use server";

import { createServerClient } from "@/lib/supabase/server";
import OpenAI from "openai";

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
    const supabase = createServerClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      return { error: "Not authenticated" };
    }

    const { data: conversation } = await supabase
      .from("chat_conversations")
      .insert({
        user_id: data.user.id,
        title: "New Conversation",
      })
      .select()
      .single()
      .throwOnError();

    return { conversation };
  } catch (error) {
    console.error("Error creating conversation:", error);
    return { error: "Failed to create conversation" };
  }
}

export async function sendMessage(conversationId: string, message: string) {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      return { error: "Not authenticated" };
    }

    await supabase
      .from("chat_messages")
      .insert({
        conversation_id: conversationId,
        role: "user",
        content: message,
      })
      .throwOnError();

    const { data: history } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .throwOnError();

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;

    const { error: aiResponseError } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: conversationId,
        role: "assistant",
        content: aiResponse,
      });

    if (aiResponseError) throw aiResponseError;

    return {
      message: aiResponse,
      history: [
        ...history,
        {
          role: "assistant",
          content: aiResponse,
          created_at: new Date().toISOString(),
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
    const supabase = createServerClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      return { error: "Not authenticated" };
    }

    const { data: messages } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .throwOnError();

    return { messages };
  } catch (error) {
    console.error("Error fetching conversation history:", error);
    return { error: "Failed to fetch conversation history" };
  }
}
