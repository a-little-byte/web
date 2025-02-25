import { createServerClient } from "@/lib/supabase/server";
import { Hono } from "hono";
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

export const chat = new Hono()
  .post("/create-conversation", async (c) => {
    try {
      const supabase = createServerClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        return c.json({ error: "Not authenticated" }, 401);
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

      return c.json({ conversation });
    } catch (error) {
      console.error("Error creating conversation:", error);
      return c.json({ error: "Failed to create conversation" }, 500);
    }
  })
  .post("/send-message", async (c) => {
    try {
      const { conversationId, message } = await c.req.json();
      const supabase = createServerClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        return c.json({ error: "Not authenticated" }, 401);
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

      return c.json({
        message: aiResponse,
        history: [
          ...history,
          {
            role: "assistant",
            content: aiResponse,
            created_at: new Date().toISOString(),
          },
        ],
      });
    } catch (error) {
      console.error("Error sending message:", error);
      return c.json({ error: "Failed to send message" }, 500);
    }
  })
  .get("/conversation/:id", async (c) => {
    try {
      const conversationId = c.req.param("id");
      const supabase = createServerClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        return c.json({ error: "Not authenticated" }, 401);
      }

      const { data: messages } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .throwOnError();

      return c.json({ messages });
    } catch (error) {
      console.error("Error fetching conversation history:", error);
      return c.json({ error: "Failed to fetch conversation history" }, 500);
    }
  });
