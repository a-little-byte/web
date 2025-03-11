import { ContextVariables } from "@/api/types";
import { idValidator } from "@/lib/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Ollama } from "ollama";
import { z } from "zod";

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const ollama = new Ollama({ host: OLLAMA_HOST });

const SYSTEM_PROMPT = `You are a helpful cybersecurity assistant for Cyna, a company that provides enterprise security solutions. 
Your main services are:
1. SOC as a Service ($2,999/month)
2. EDR Protection ($15/endpoint/month)
3. XDR Platform ($4,999/month)

Be friendly and professional. Keep responses concise but informative. If asked about pricing or services, provide accurate information from the list above.
For technical questions, provide accurate but easy-to-understand explanations.`;

const generateOllamaResponse = async (
  messages: Array<{ role: string; content: string }>
) => {
  try {
    const response = await ollama.chat({
      model: "mistral",
      messages,
    });
    return response.message.content;
  } catch (error) {
    console.error("Error calling Ollama:", error);
    throw new Error("Failed to get response from Ollama");
  }
};

export const chatRouter = new Hono<{ Variables: ContextVariables }>()
  .post("/", async ({ var: { db }, json }) => {
    try {
      const user = await db.selectFrom("users").selectAll().executeTakeFirst();
      if (!user) {
        return json({ error: "Not authenticated" }, 401);
      }

      const conversation = await db
        .insertInto("chat_conversations")
        .values({
          user_id: user.id,
          title: "New Conversation",
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      return json({ conversation });
    } catch (error) {
      console.error("Error creating conversation:", error);
      return json({ error: "Failed to create conversation" }, 500);
    }
  })
  .post(
    "/:chatId",
    zValidator("param", z.object({ chatId: idValidator })),
    zValidator("json", z.object({ message: z.string() })),
    async ({ var: { db }, json, req }) => {
      try {
        const { chatId } = req.valid("param");
        const { message } = req.valid("json");
        const user = await db
          .selectFrom("users")
          .selectAll()
          .executeTakeFirst();
        if (!user) {
          return json({ error: "Not authenticated" }, 401);
        }

        await db
          .insertInto("chat_messages")
          .values({
            conversation_id: chatId,
            role: "user",
            content: message,
          })
          .execute();

        const history = await db
          .selectFrom("chat_messages")
          .selectAll()
          .where("conversation_id", "=", chatId)
          .orderBy("created_at", "asc")
          .execute();

        const messages = [
          { role: "system", content: SYSTEM_PROMPT },
          ...history.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          })),
        ];

        const aiResponse = await generateOllamaResponse(messages);

        await db
          .insertInto("chat_messages")
          .values({
            conversation_id: chatId,
            role: "assistant",
            content: aiResponse,
          })
          .execute();

        return json({
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
        return json({ error: "Failed to send message" }, 500);
      }
    }
  )
  .get(
    "/:chatId",
    zValidator("param", z.object({ chatId: idValidator })),
    async ({ var: { db }, json, req }) => {
      try {
        const { chatId } = req.valid("param");
        const user = await db
          .selectFrom("users")
          .selectAll()
          .executeTakeFirst();
        if (!user) {
          return json({ error: "Not authenticated" }, 401);
        }

        const messages = await db
          .selectFrom("chat_messages")
          .where("conversation_id", "=", chatId)
          .orderBy("created_at", "asc")
          .selectAll()
          .execute();

        return json({ messages });
      } catch (error) {
        console.error("Error fetching conversation history:", error);
        return json({ error: "Failed to fetch conversation history" }, 500);
      }
    }
  );
