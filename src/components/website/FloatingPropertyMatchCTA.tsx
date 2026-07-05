"use client";

import { Sparkles } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function FloatingPropertyMatchCTA() {
  const pathname = usePathname();
  const router = useRouter();

  const openFinder = () => {
    const finder = document.getElementById("property-match-finder");
    if (finder) {
      finder.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push("/#property-match-finder");
  };

  if (pathname?.startsWith("/crm")) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={openFinder}
      className="fixed bottom-[calc(4.9rem+env(safe-area-inset-bottom))] left-3 z-50 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#081120]/94 px-4 text-xs font-black uppercase tracking-[0.12em] text-[#F5D67B] shadow-[0_18px_42px_rgba(0,0,0,0.28)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-[#D4AF37] hover:text-[#081120] md:bottom-5 md:left-5 md:min-h-12 md:px-5"
      aria-label="Find my property"
    >
      <Sparkles className="h-4 w-4" />
      Find My Property
    </button>
  );
}
