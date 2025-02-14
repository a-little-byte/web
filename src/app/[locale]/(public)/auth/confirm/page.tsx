"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmEmail() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    async function verifyEmail() {
      try {
        if (!token) throw new Error("No verification token found");

        // Update the user's email_verified status
        const { error } = await supabase
          .from("auth.users")
          .update({ email_verified: true })
          .eq("id", token);

        if (error) throw error;

        // Redirect to login after successful verification
        router.push("/login");
      } catch (err) {
        console.error("Error verifying email:", err);
        setError("Failed to verify email. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    }

    verifyEmail();
  }, [token, router]);

  if (isVerifying) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => router.push("/login")}>Return to Login</Button>
      </div>
    );
  }

  return null;
}
