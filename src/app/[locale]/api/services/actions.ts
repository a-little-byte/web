"use server";

import { Service } from "@/db/schema";
import { db } from "@/lib/db";

export async function getServices() {
  try {
    const services = await db
      .selectFrom("services")
      .selectAll()
      .orderBy("created_at")
      .execute();

    return { services };
  } catch (error) {
    console.error("Error fetching services:", error);
    return { error: "Failed to fetch services" };
  }
}

export async function createService(
  data: Omit<Service, "id" | "created_at" | "updated_at">
) {
  try {
    const service = await db
      .insertInto("services")
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow();

    return { service };
  } catch (error) {
    console.error("Error creating service:", error);
    return { error: "Failed to create service" };
  }
}

export async function updateService(id: string, data: Partial<Service>) {
  try {
    const service = await db
      .updateTable("services")
      .set(data)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return { service };
  } catch (error) {
    console.error("Error updating service:", error);
    return { error: "Failed to update service" };
  }
}

export async function deleteService(id: string) {
  try {
    await db.deleteFrom("services").where("id", "=", id).execute();

    return { success: true };
  } catch (error) {
    console.error("Error deleting service:", error);
    return { error: "Failed to delete service" };
  }
}
