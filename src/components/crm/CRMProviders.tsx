"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { Toaster } from "sonner";

import { ToastProvider } from "@/components/ui/toast";

interface CRMProvidersProps {
  children: React.ReactNode;
  session: Session;
}

export default function CRMProviders({ children, session }: CRMProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ToastProvider>
        {children}
        <Toaster richColors theme="dark" position="bottom-right" />
      </ToastProvider>
    </SessionProvider>
  );
}
