"use server";

import { getCurrentUser } from "@/app/[locale]/api/auth/actions";
import { createServerClient } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";

export const updateProfile = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  try {
    const supabase = createServerClient();
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    if (email !== user.email) {
      const { data: existingUser, error: searchError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (searchError) throw searchError;
      if (existingUser) {
        return { error: "Email already taken" };
      }
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        full_name: fullName,
        email,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile" };
  }
};

export const changePassword = async ({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const supabase = createServerClient();
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return { error: "Current password is incorrect" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { error: "Failed to change password" };
  }
};

export const deleteAccount = async () => {
  try {
    const supabase = createServerClient();
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", user.id);

    if (deleteError) throw deleteError;

    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { error: "Failed to delete account" };
  }
};
