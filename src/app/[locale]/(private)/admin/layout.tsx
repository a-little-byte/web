"use client";

import ScrambleHover from "@/components/ui/scramble";
import { isAdmin } from "@/lib/auth";
import { Link, useRouter } from "@/lib/i18n/routing";
import jwt from "jsonwebtoken";
import type { UUID } from "node:crypto";
import { useEffect } from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)auth-token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      if (!token) {
        router.push("/auth/login");
        return;
      }

      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "your-secret-key"
        ) as { userId: UUID };
        const adminStatus = await isAdmin(decoded.userId);

        if (!adminStatus) {
          router.push("/");
        }
      } catch (error) {
        // router.push("/auth/login");
      }
    };

    checkAdmin();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-card border-r">
        <nav className="p-4 space-y-2">
          <h2 className="text-lg font-semibold mb-4">
            <ScrambleHover
              text="Admin Dashboard"
              sequential={true}
              revealDirection="start"
              useOriginalCharsOnly={false}
              className="font-azeretMono"
            />
          </h2>
          <Link href="/admin" className="block p-2 hover:bg-accent rounded-md">
            Dashboard
          </Link>
          <Link
            href="/admin/services"
            className="block p-2 hover:bg-accent rounded-md"
          >
            Services
          </Link>
          <Link
            href="/admin/content"
            className="block p-2 hover:bg-accent rounded-md"
          >
            Page Content
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
