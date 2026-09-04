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
    if (typeof window === "undefined") return;

    // Check if the administrator is actively authenticated in this browser
    const isLocalAuth =
      localStorage.getItem("shivara_admin_auth") === "true" ||
      document.cookie.includes("shivara_admin_auth=true");

    if (!isLocalAuth) {
      setIsAuthenticated(false);
      window.location.href = "/crm/login";
      return;
    }

    setIsAuthenticated(true);
  }, []);

  if (isAuthenticated !== true) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#081120] text-sm text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#F4B400] border-t-transparent" />
          <p className="text-xs font-semibold uppercase tracking-widest text-[#F4B400]">
            {isAuthenticated === false ? "Redirecting to CRM login…" : "Verifying secure session…"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <SessionProvider session={session} refetchInterval={0} refetchOnWindowFocus={false}>
      <ToastProvider>
        <SidebarProvider>{children}</SidebarProvider>
        <Toaster richColors theme="dark" position="bottom-right" />
      </ToastProvider>
    </SessionProvider>
  );
}
