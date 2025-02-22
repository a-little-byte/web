"use server";

import { createServerClient } from "@/lib/supabase/server";
import { Tables } from "@/types/supabase";

export async function getServices() {
  try {
    const supabase = createServerClient();
    const { data: services, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at");

    if (error) throw error;

    return { services };
  } catch (error) {
    console.error("Error fetching services:", error);
    return { error: "Failed to fetch services" };
  }
}

export async function createService(
  data: Omit<Tables<"services">, "id" | "created_at" | "updated_at">
) {
  try {
    const supabase = createServerClient();
    const { data: service, error } = await supabase
      .from("services")
      .insert(data)
      .select()
      .single();

    return { service };
  } catch (error) {
    console.error("Error creating service:", error);
    return { error: "Failed to create service" };
  }
}

export async function updateService(
  id: string,
  data: Partial<Tables<"services">>
) {
  try {
    const supabase = createServerClient();
    const { data: service, error } = await supabase
      .from("services")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { service };
  } catch (error) {
    console.error("Error updating service:", error);
    return { error: "Failed to update service" };
  }
}

export async function deleteService(id: string) {
  try {
    const supabase = createServerClient();
    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting service:", error);
    return { error: "Failed to delete service" };
  }
}
