"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDays, Menu, Phone, X } from "lucide-react";
import { Monogram } from "@/components/website/LuxurySection";
import { navLinks, siteConfig } from "@/components/website/site-data";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || mobileOpen
          ? "border-b border-[#D4AF37]/15 bg-[#081120]/92 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl"
          : "bg-gradient-to-b from-[#081120]/78 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="group flex items-center gap-3" aria-label="The Shivara Group home">
          <Monogram className="h-11 w-11 text-2xl font-black transition-transform duration-300 group-hover:scale-105" />
          <div className="leading-none">
            <p className="font-[family-name:var(--font-playfair)] text-xl font-semibold tracking-[-0.02em] text-white">
              The Shivara Group
            </p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.28em] text-[#D4AF37]">
              Luxury Real Estate
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.055] p-1 backdrop-blur lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                isActive(link.href)
                  ? "bg-[#D4AF37] text-[#081120]"
                  : "text-white/76 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={siteConfig.phoneHref}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/12 px-4 text-sm font-bold text-white/82 transition-all hover:border-[#D4AF37]/70 hover:text-[#F5D67B]"
          >
            <Phone className="h-4 w-4" />
            {siteConfig.phone}
          </a>
          <Link
            href="/contact#site-visit"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-black uppercase tracking-[0.12em] text-[#081120] transition-all hover:-translate-y-0.5 hover:bg-[#F5D67B]"
          >
            <CalendarDays className="h-4 w-4" />
            Site Visit
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-white backdrop-blur transition-all hover:border-[#D4AF37]/70 lg:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={`lg:hidden overflow-hidden border-t border-white/10 bg-[#081120]/96 backdrop-blur-xl transition-[max-height,opacity] duration-500 ${
          mobileOpen ? "max-h-[540px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-2xl px-4 py-4 text-base font-bold transition-all ${
                isActive(link.href)
                  ? "bg-[#D4AF37] text-[#081120]"
                  : "bg-white/[0.045] text-white/82 hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="grid grid-cols-2 gap-3 pt-3">
            <a
              href={siteConfig.phoneHref}
              className="flex min-h-12 items-center justify-center rounded-2xl border border-white/12 text-sm font-black text-white"
            >
              Call Now
            </a>
            <Link
              href="/contact#site-visit"
              className="flex min-h-12 items-center justify-center rounded-2xl bg-[#D4AF37] text-sm font-black text-[#081120]"
            >
              Site Visit
            </Link>
          </div>
          <Link
            href="/crm/login"
            className="mt-2 rounded-2xl px-4 py-3 text-center text-xs font-black uppercase tracking-[0.24em] text-white/46"
          >
            CRM Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
