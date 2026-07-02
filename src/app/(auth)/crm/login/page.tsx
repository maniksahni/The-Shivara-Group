import { Suspense } from "react";
import CRMLoginClient from "./LoginClient";

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
