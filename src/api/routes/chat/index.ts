import { ContextVariables } from "@/api/types";
import { idValidator } from "@/lib/validators";
import { zValidator } from "@hono/zod-validator";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { Hono } from "hono";
import { Ollama } from "ollama";
import { z } from "zod";

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const ollama = new Ollama({ host: OLLAMA_HOST });
const ollamaModel = "mistral";

const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: OLLAMA_HOST,
});

const chatModel = new ChatOllama({
  baseUrl: OLLAMA_HOST,
  model: ollamaModel,
});

const vectorStore = new PGVectorStore(embeddings, {
  connectionString: process.env.DATABASE_URL,
  tableName: "documents",
  columns: {
    idColumnName: "id",
    vectorColumnName: "embedding",
    contentColumnName: "content",
    metadataColumnName: "metadata",
  },
});

const SYSTEM_PROMPT = `You are a helpful cybersecurity assistant for Cyna, a company that provides enterprise security solutions. 
Your main services are:
1. SOC as a Service ($2,999/month)
2. EDR Protection ($15/endpoint/month)
3. XDR Platform ($4,999/month)

Be friendly and professional. Keep responses concise but informative. If asked about pricing or services, provide accurate information from the list above.
For technical questions, provide accurate but easy-to-understand explanations.`;

const ragPromptTemplate = PromptTemplate.fromTemplate(`
System: ${SYSTEM_PROMPT}

Context information is below.
---------------------
{context}
---------------------

Chat History:
{chatHistory}

User: {question}
Assistant: `);

// Create the RAG pipeline
const createRagChain = () => {
  const retriever = vectorStore.asRetriever({
    k: 5, // Number of documents to retrieve
  });

  return RunnableSequence.from([
    {
      question: (input) => input.question,
      chatHistory: (input) => input.chatHistory,
      context: async (input) => {
        const relevantDocs = await retriever.invoke(input.question);
        return formatDocumentsAsString(relevantDocs);
      },
    },
    ragPromptTemplate,
    chatModel,
    new StringOutputParser(),
  ]);
};

const ragChain = createRagChain();

const generateOllamaResponse = async (
  messages: Array<{ role: string; content: string }>,
  userMessage: string
) => {
  try {
    // Format chat history for the RAG chain
    const chatHistory = messages
      .filter((msg) => msg.role !== "system")
      .map(
        (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    // Use the RAG chain to generate a response
    const response = await ragChain.invoke({
      question: userMessage,
      chatHistory: chatHistory,
    });

    return response;
  } catch (error) {
    console.error("Error calling RAG chain:", error);

    try {
      const response = await ollama.chat({
        model: ollamaModel,
        messages,
      });
      return response.message.content;
    } catch (ollamaError) {
      console.error("Error calling Ollama fallback:", ollamaError);
      throw new Error("Failed to get response from AI");
    }
  }
};

export const chatRouter = new Hono<{ Variables: ContextVariables }>()
  .post("/", async ({ var: { db }, json }) => {
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
  })
  .post(
    "/:chatId",
    zValidator("param", z.object({ chatId: idValidator })),
    zValidator("json", z.object({ message: z.string() })),
    async ({ var: { db }, json, req }) => {
      const { chatId } = req.valid("param");
      const { message } = req.valid("json");
      const user = await db.selectFrom("users").selectAll().executeTakeFirst();
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
        .orderBy("createdAt", "asc")
        .execute();

      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      ];

      const aiResponse = await generateOllamaResponse(messages, message);

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
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }
  )
  .get(
    "/:chatId",
    zValidator("param", z.object({ chatId: idValidator })),
    async ({ var: { db }, json, req }) => {
      const { chatId } = req.valid("param");
      const user = await db.selectFrom("users").selectAll().executeTakeFirst();
      if (!user) {
        return json({ error: "Not authenticated" }, 401);
      }

      const messages = await db
        .selectFrom("chat_messages")
        .where("conversation_id", "=", chatId)
        .orderBy("createdAt", "asc")
        .selectAll()
        .execute();

      return json({ messages });
    }
  )
  .post(
    "/ingest",
    zValidator(
      "json",
      z.object({
        documents: z.array(
          z.object({
            content: z.string(),
            metadata: z.record(z.string(), z.any()).optional(),
          })
        ),
      })
    ),
    async ({ json, req }) => {
      const { documents } = req.valid("json");

      const formattedDocs = documents.map((doc) => ({
        pageContent: doc.content,
        metadata: doc.metadata || {},
      }));

      await vectorStore.addDocuments(formattedDocs);

      return json({ success: true, count: documents.length });
    }
  );
