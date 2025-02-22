"use client";

import ScrambleHover from "@/components/ui/scramble";
import { useRouter } from "@/i18n/routing";
import { isAdmin } from "@/lib/auth";
import jwt from "jsonwebtoken";
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
        ) as { userId: string };
        const adminStatus = await isAdmin(decoded.userId);

        if (!adminStatus) {
          router.push("/");
        }
      } catch (error) {
        // router.push("/auth/login");
      }
    };

    checkAdmin();
  }, [router]);

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
          <a href="/admin" className="block p-2 hover:bg-accent rounded-md">
            Dashboard
          </a>
          <a
            href="/admin/services"
            className="block p-2 hover:bg-accent rounded-md"
          >
            Services
          </a>
          <a
            href="/admin/content"
            className="block p-2 hover:bg-accent rounded-md"
          >
            Page Content
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
