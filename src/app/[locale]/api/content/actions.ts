"use server";

import { db } from "@/lib/db";

export async function getPageContent(section: string) {
  try {
    const content = await db
      .selectFrom("page_content")
      .where("section", "=", section)
      .selectAll()
      .executeTakeFirst();

    return { content };
  } catch (error) {
    console.error("Error fetching page content:", error);
    return { error: "Failed to fetch page content" };
  }
}

export async function updatePageContent(section: string, content: any) {
  try {
    const result = await db
      .insertInto("page_content")
      .values({
        section,
        content,
      })
      .onConflict((oc) =>
        oc.column("section").doUpdateSet({
          content,
          updated_at: new Date(),
        }),
      )
      .returningAll()
      .executeTakeFirstOrThrow();

    return { content: result };
  } catch (error) {
    console.error("Error updating page content:", error);
    return { error: "Failed to update page content" };
  }
}
