"use server";

import { createServerClient } from "@/lib/supabase/server";

export const updateProfile = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
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
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return { error: "Not authenticated" };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      if (error.message.includes("password")) {
        return { error: "Current password is incorrect" };
      }
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { error: "Failed to change password" };
  }
};

export const deleteAccount = async () => {
  try {
    const supabase = createServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return { error: "Not authenticated" };
    }

    const { error } = await supabase.auth.admin.deleteUser(session.user.id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { error: "Failed to delete account" };
  }
};
