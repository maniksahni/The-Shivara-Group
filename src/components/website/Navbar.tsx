"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// ─── Nav link definition ───────────────────────────────────────────────────────
const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Properties", href: "/properties" },
  { label: "Contact", href: "/contact" },
] as const;

// ─── Navbar Component ─────────────────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Listen to scroll to toggle background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll(); // run once on mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  // Determine if a link is active
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Decide text colour based on scroll state
  const linkColor = scrolled ? "text-[#0F1B2D]" : "text-white";
  const hoverColor = scrolled
    ? "hover:text-[#C9A84C]"
    : "hover:text-[#C9A84C]";

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-40
        transition-all duration-500 ease-out
        ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-[#C9A84C]/20"
            : "bg-transparent"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-3 group flex-shrink-0"
            aria-label="The Shivara Group — Home"
          >
            {/* Building icon in gold */}
            <div
              className={`
                flex items-center justify-center w-10 h-10 rounded-lg
                transition-transform duration-300 group-hover:scale-105
                ${scrolled ? "bg-[#0F1B2D]" : "bg-[#C9A84C]/20 border border-[#C9A84C]/40"}
              `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-[#C9A84C]"
              >
                <path d="M19 2H9a2 2 0 00-2 2v3H5a2 2 0 00-2 2v11a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2zm-7 17H9v-2h3v2zm0-4H9v-2h3v2zm0-4H9v-2h3v2zm6 8h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V9h4v2zm0-4H9V4h9v3z" />
              </svg>
            </div>

            {/* Brand name */}
            <div className="leading-tight">
              <span
                className={`
                  block font-[family-name:var(--font-playfair)]
                  font-bold text-lg tracking-wide
                  transition-colors duration-300
                  text-[#C9A84C]
                `}
              >
                The Shivara Group
              </span>
              <span
                className={`
                  block text-[10px] font-[family-name:var(--font-inter)]
                  tracking-[0.2em] uppercase font-medium
                  transition-colors duration-300
                  ${scrolled ? "text-[#0F1B2D]/60" : "text-white/70"}
                `}
              >
                Premium Real Estate
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav className="hidden md:flex items-center gap-8" role="navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative text-sm font-medium tracking-wide
                  transition-colors duration-300
                  ${linkColor} ${hoverColor}
                  group py-1
                  ${isActive(link.href) ? "text-[#C9A84C]" : ""}
                `}
              >
                {link.label}
                {/* Animated underline */}
                <span
                  className={`
                    absolute bottom-0 left-0 h-0.5 bg-[#C9A84C]
                    transition-all duration-300 ease-out
                    ${isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                />
              </Link>
            ))}

            {/* Vertical separator */}
            <div
              className={`
                h-5 w-px transition-colors duration-300
                ${scrolled ? "bg-gray-300" : "bg-white/30"}
              `}
            />

            {/* CRM Login — subtle link */}
            <Link
              href="/crm/login"
              className={`
                text-xs font-medium tracking-widest uppercase
                border rounded px-3 py-1.5
                transition-all duration-300
                ${
                  scrolled
                    ? "text-[#0F1B2D]/60 border-[#0F1B2D]/20 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                    : "text-white/60 border-white/20 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                }
              `}
            >
              CRM Login
            </Link>
          </nav>

          {/* ── Mobile: Hamburger Button ── */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`
              md:hidden flex flex-col justify-center items-center
              w-10 h-10 rounded-lg gap-1.5
              transition-colors duration-300
              ${scrolled ? "text-[#0F1B2D]" : "text-white"}
            `}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {/* Three bar lines with animated open/close */}
            <span
              className={`
                block h-0.5 bg-current rounded-full
                transition-all duration-300 origin-center
                ${mobileOpen ? "w-6 rotate-45 translate-y-2" : "w-6"}
              `}
            />
            <span
              className={`
                block h-0.5 bg-current rounded-full
                transition-all duration-300
                ${mobileOpen ? "w-0 opacity-0" : "w-5"}
              `}
            />
            <span
              className={`
                block h-0.5 bg-current rounded-full
                transition-all duration-300 origin-center
                ${mobileOpen ? "w-6 -rotate-45 -translate-y-2" : "w-4"}
              `}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer Menu ── */}
      <div
        ref={menuRef}
        className={`
          md:hidden
          transition-all duration-400 ease-out
          overflow-hidden
          ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          ${scrolled ? "bg-white border-t border-gray-100" : "bg-[#0F1B2D]/95 backdrop-blur-md"}
        `}
      >
        <nav className="px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center py-3 px-2
                text-sm font-medium rounded-lg
                transition-all duration-200
                border-b border-transparent
                ${
                  isActive(link.href)
                    ? "text-[#C9A84C] bg-[#C9A84C]/5"
                    : scrolled
                      ? "text-[#0F1B2D] hover:text-[#C9A84C] hover:bg-gray-50"
                      : "text-white/90 hover:text-[#C9A84C] hover:bg-white/5"
                }
              `}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile CRM Login */}
          <Link
            href="/crm/login"
            className={`
              mt-3 py-2.5 px-4 text-center
              text-xs font-medium tracking-widest uppercase
              border rounded-lg
              transition-all duration-200
              ${
                scrolled
                  ? "text-[#0F1B2D]/60 border-[#0F1B2D]/20 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                  : "text-white/60 border-white/20 hover:border-[#C9A84C] hover:text-[#C9A84C]"
              }
            `}
          >
            CRM Login
          </Link>

          {/* Quick call button in mobile menu */}
          <a
            href="tel:+917060788407"
            className="
              mt-2 py-2.5 px-4 text-center
              text-sm font-semibold
              bg-[#C9A84C] text-[#0F1B2D] rounded-lg
              hover:bg-[#b8953d]
              transition-colors duration-200
            "
          >
            📞 Call Now: +91 7060788407
          </a>
        </nav>
      </div>
    </header>
  );
}
