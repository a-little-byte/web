"use client";

import { AdminSidebar } from "@/components/layout/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "@/lib/i18n/routing";
import { useEffect } from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)auth-token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1",
      );

      if (!token) {
        router.push("/auth/login");
        return;
      }
    };

    checkAdmin();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <AdminSidebar />
        <main className="flex-1 px-8 py-4">
          <SidebarTrigger className="mb-4" />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
