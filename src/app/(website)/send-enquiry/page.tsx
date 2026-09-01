"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function SendEnquiryRedirectPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search;
      window.location.replace(`/#send-enquiry${search}`);
    }
  }, []);

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#081120] px-5 py-20 text-white">
      <div className="flex flex-col items-center justify-center text-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#D4AF37]" />
        <p className="mt-4 text-sm font-semibold tracking-wider text-slate-300">
          Redirecting to Shivara Enquiry Form…
        </p>
      </div>
    </main>
  );
}
