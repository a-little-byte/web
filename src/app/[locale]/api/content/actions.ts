"use server";

import { createServerClient } from "@/lib/supabase/server";

export async function getPageContent(section: string) {
  try {
    const supabase = createServerClient();
    const { data: content, error } = await supabase
      .from("page_content")
      .select("*")
      .eq("section", section)
      .single();

    if (error) throw error;

    return { content };
  } catch (error) {
    console.error("Error fetching page content:", error);
    return { error: "Failed to fetch page content" };
  }
}

export async function updatePageContent(section: string, content: any) {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("page_content")
      .upsert(
        {
          section,
          content,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "section",
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error updating page content:", error);
    return { error: "Failed to update page content" };
  }
}
