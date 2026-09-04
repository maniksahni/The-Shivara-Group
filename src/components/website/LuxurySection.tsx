import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type ButtonVariant = "gold" | "navy" | "light" | "outline";

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className="mb-3 flex max-w-full min-w-0 items-center gap-3 sm:mb-4">
      <span className="h-px w-10 shrink-0 bg-[#D4AF37]" />
      <span
        className={`min-w-0 text-[10px] font-black uppercase tracking-[0.22em] sm:text-[11px] sm:tracking-[0.34em] ${
          dark ? "text-[#F5D67B]" : "text-[#9B7A19]"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

export function LuxuryButton({
  href,
  children,
  variant = "gold",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}) {
  const variants: Record<ButtonVariant, string> = {
    gold:
      "bg-[#D4AF37] text-[#081120] shadow-[0_18px_45px_rgba(212,175,55,0.28)] hover:bg-[#F5D67B]",
    navy:
      "bg-[#081120] text-white shadow-[0_18px_45px_rgba(8,17,32,0.22)] hover:bg-[#13223A]",
    light:
      "bg-white text-[#081120] shadow-[0_18px_45px_rgba(8,17,32,0.12)] hover:bg-[#F8F3E2]",
    outline:
      "border border-[#D4AF37]/50 bg-white/10 text-white backdrop-blur hover:bg-[#D4AF37] hover:text-[#081120]",
  };

  return (
    <Link
      href={href}
      className={`group inline-flex min-h-12 max-w-full items-center justify-center gap-2 rounded-full px-5 text-center text-xs font-black uppercase tracking-[0.12em] ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.985] sm:px-6 sm:text-sm sm:tracking-[0.16em] ${variants[variant]} ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

export function SectionShell({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative px-4 py-5 sm:px-8 sm:py-14 lg:px-12 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  dark = false,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-5 max-w-3xl sm:mb-10 ${align === "center" ? "mx-auto text-center" : ""}`}>
      <div className={align === "center" ? "flex justify-center" : ""}>
        <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      </div>
      <h2
        className={`font-[family-name:var(--font-playfair)] text-[1.92rem] font-semibold leading-[1.03] tracking-[-0.04em] sm:text-5xl sm:tracking-[-0.04em] lg:text-6xl ${
          dark ? "text-white" : "text-[#081120]"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-2.5 text-[14px] leading-6 sm:mt-5 sm:text-lg sm:leading-8 ${
            dark ? "text-white/68" : "text-[#4B5563]"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function GoldDivider() {
  return (
    <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
  );
}

export function Monogram({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-full border border-[#D4AF37]/35 bg-[#FFFDF9] shadow-[0_12px_32px_rgba(212,175,55,0.25)] ${className}`}
    >
      <Image
        src="/logo.png"
        alt="The Shivara Group Logo"
        fill
        sizes="96px"
        className="object-contain p-0.5"
      />
    </div>
  );
}
