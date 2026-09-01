"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { Toaster } from "sonner";
import { useRouter } from "next/navigation";

import { ToastProvider } from "@/components/ui/toast";
import { SidebarProvider } from "@/components/crm/Sidebar";

interface CRMProvidersProps {
  children: React.ReactNode;
  session: Session;
}

export default function CRMProviders({ children, session }: CRMProvidersProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const isLocalAuth =
      localStorage.getItem("shivara_admin_auth") === "true" ||
      document.cookie.includes("shivara_admin_auth=true");

    if (!isLocalAuth && !session?.user?.email) {
      setIsAuthenticated(false);
      router.replace("/crm/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router, session]);

  if (isAuthenticated === false) {
    return null;
  }

  return (
    <SessionProvider session={session}>
      <ToastProvider>
        <SidebarProvider>{children}</SidebarProvider>
        <Toaster richColors theme="dark" position="bottom-right" />
      </ToastProvider>
    </SessionProvider>
  );
}
