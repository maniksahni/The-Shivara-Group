import Link from "next/link";
import { ArrowUpRight, MapPin, MessageCircle, Phone, Sparkles } from "lucide-react";
import { Monogram } from "@/components/website/LuxurySection";
import { navLinks, propertyCategories, services, siteConfig } from "@/components/website/site-data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#081120] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(212,175,55,0.18),transparent_32%),radial-gradient(circle_at_85%_30%,rgba(16,185,129,0.12),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mb-12 grid gap-6 rounded-[2rem] border border-[#D4AF37]/18 bg-white/[0.045] p-6 backdrop-blur md:grid-cols-[1.2fr_0.8fr] md:p-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-[#D4AF37]">
              Ready to move from scrolling to visiting?
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Book a private property consultation with Shivara.
            </h2>
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row md:flex-col lg:flex-row">
            <a
              href={siteConfig.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#10B981] px-6 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <Link
              href="/contact#site-visit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 text-sm font-black uppercase tracking-[0.14em] text-[#081120] transition hover:-translate-y-0.5"
            >
              Book Site Visit
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Monogram className="h-12 w-12 text-2xl font-black" />
              <div>
                <p className="font-[family-name:var(--font-playfair)] text-2xl font-semibold">
                  The Shivara Group
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">
                  Premium Real Estate
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/62">
              Luxury real estate guidance for buyers who want clarity, verified conversations,
              and a polished journey from first enquiry to site visit.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white/70 transition hover:border-[#D4AF37] hover:text-[#F5D67B]"
              >
                <Sparkles className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white/70 transition hover:border-[#10B981] hover:text-[#10B981]"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.24em] text-[#D4AF37]">
              Explore
            </h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/62 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/crm/login" className="text-sm text-white/40 transition hover:text-white">
                  CRM Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.24em] text-[#D4AF37]">
              Services
            </h3>
            <ul className="mt-5 space-y-3">
              {services.slice(0, 5).map((service) => (
                <li key={service.title} className="text-sm text-white/62">
                  {service.title}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.24em] text-[#D4AF37]">
              Contact
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-white/62">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />
                <span>
                  {siteConfig.location}
                  <br />
                  Full office address: Manual completion required
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />
                <a href={siteConfig.phoneHref} className="transition hover:text-white">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />
                <a href={siteConfig.instagram} className="transition hover:text-white">
                  {siteConfig.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6">
          <div className="mb-5 flex flex-wrap gap-2">
            {propertyCategories.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/42"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="flex flex-col justify-between gap-3 text-xs text-white/42 sm:flex-row">
            <p>© {year} The Shivara Group. All rights reserved.</p>
            <p>
              Pricing, availability, office address, loan partners and ratings should be manually
              verified before final publication.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
