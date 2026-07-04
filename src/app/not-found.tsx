import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] bg-[#081120] px-5 py-20 text-white sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[72vh] max-w-5xl flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-[#D4AF37] text-[#081120] shadow-[0_18px_45px_rgba(212,175,55,0.28)]">
          <Search className="h-9 w-9" />
        </div>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.34em] text-[#D4AF37]">
          404 — address not found
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-[2.55rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-7xl sm:tracking-[-0.06em]">
          This property address does not exist.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">
          The page may have moved, or the listing is no longer public. Explore verified
          opportunities or return to the homepage.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/properties"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#D4AF37] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#081120]"
          >
            Browse Properties
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/12 px-6 text-sm font-black uppercase tracking-[0.16em] text-white"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
