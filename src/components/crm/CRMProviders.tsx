"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

interface CRMProvidersProps {
  children: React.ReactNode;
  session: Session;
}

export default function CRMProviders({ children, session }: CRMProvidersProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
