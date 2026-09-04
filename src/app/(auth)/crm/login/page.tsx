import { Suspense } from "react";
import type { Metadata } from "next";
import CRMLoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "CRM Login | The Shivara Group",
  description: "Secure CRM access for The Shivara Group team.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CRMLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-400">
          Loading secure login…
        </div>
      }
    >
      <CRMLoginClient />
    </Suspense>
  );
}
