"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Building2, Trophy, Users, ShieldCheck, HeartHandshake } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { value: "Bareilly", label: "Primary Market", icon: Trophy },
    { value: "Delhi NCR", label: "Advisory Reach", icon: Users },
    { value: "Aurika", label: "Featured Project", icon: Building2 },
  ];

  const values = [
    {
      title: "Integrity",
      description: "We believe real estate is more than a transaction — it is the careful curation of a lifestyle and legacy.",
      icon: ShieldCheck,
    },
    {
      title: "Client-Centricity",
      description: "Every recommendation is shaped around the client's goals, preferred location, budget, and long-term portfolio vision.",
      icon: HeartHandshake,
    },
    {
      title: "Premium Market Focus",
      description: "Our public portfolio highlights Bareilly, Delhi NCR, luxury residences, plots, and site-visit-led real estate advisory.",
      icon: Sparkles,
    },
  ];

  return (
    <main className="bg-[#F8F7F4] min-h-screen text-[#1A1A2E] font-[family-name:var(--font-inter)]">
      {/* ── Page Hero ── */}
      <section className="relative py-24 bg-[#0F1B2D] text-white overflow-hidden" aria-label="About Hero">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #C9A84C 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="block h-px w-8 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs font-semibold uppercase tracking-[0.2em]">Our Story</span>
            <span className="block h-px w-8 bg-[#C9A84C]" />
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            About <span className="text-[#C9A84C]">The Shivara Group</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/70 text-base sm:text-lg">
            Bespoke real estate strategies defining legacies, one address at a time.
          </p>
        </div>
      </section>

      {/* ── Story Section ── */}
      <section className="py-20 max-w-6xl mx-auto px-6" aria-label="Our History">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#0F1B2D]">
              Where Legacy Meets Location
            </h2>
            <div className="w-16 h-1 bg-[#C9A84C] rounded" />
            <p className="text-gray-600 leading-relaxed">
              The Shivara Group presents premium real estate opportunities across Bareilly and Delhi NCR with a tone of curated, lifestyle-led advisory. Public Instagram content positions the brand around luxury real estate, portfolio management, site visits, and landmark residential opportunities.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The brand highlights that real estate is more than a transaction: it is the curation of lifestyle, location, and legacy. Its visible project communication includes Aurika / The Residences in Bareilly and consultation-led property discovery.
            </p>
            <p className="text-gray-600 leading-relaxed font-semibold text-[#0F1B2D]">
              For verified project details, exact office address, team profiles, testimonials, and working hours, please confirm manually from the company before publishing.
            </p>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0F1B2D] text-white rounded-2xl p-8 border border-white/5 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-xl" />
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] flex-shrink-0">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#C9A84C]">{stat.value}</span>
                    <span className="block text-white/70 text-sm font-medium">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values Section ── */}
      <section className="py-20 bg-[#0F1B2D] text-white" aria-label="Our Core Values">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#C9A84C] text-xs font-semibold uppercase tracking-[0.2em] block mb-2">Our Foundation</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold">Core Principles We Live By</h2>
            <div className="w-16 h-1 bg-[#C9A84C] rounded mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#C9A84C]/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] mb-6">
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Publicly Available Brand Information ── */}
      <section className="py-20 max-w-6xl mx-auto px-6" aria-label="Public Brand Information">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#C9A84C] text-xs font-semibold uppercase tracking-[0.2em] block mb-2">Verified From Instagram</span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#0F1B2D]">Public Brand Signals</h2>
          <div className="w-16 h-1 bg-[#C9A84C] rounded mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Premium Real Estate", role: "Luxury homes, plots, and advisory", initials: "RE" },
            { name: "Aurika / The Residences", role: "Featured Bareilly project", initials: "AU" },
            { name: "Site Visits", role: "Public captions invite bookings", initials: "SV" },
            { name: "Team Details", role: "Manual completion required", initials: "MC" },
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-20 h-20 rounded-full bg-[#0F1B2D] text-[#C9A84C] font-bold text-2xl flex items-center justify-center mx-auto mb-4 border-2 border-[#C9A84C]">
                {t.initials}
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#0F1B2D]">{t.name}</h3>
              <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-wider mt-1">{t.role}</p>
              <p className="text-gray-500 text-xs mt-3 leading-relaxed">
                {t.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Call To Action ── */}
      <section className="py-20 bg-gradient-to-br from-[#080E19] to-[#0F1B2D] text-white text-center relative overflow-hidden" aria-label="CTA">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#C9A84C] via-transparent to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold">
            Ready to find your next home in Bareilly?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto text-sm sm:text-base">
            Reach out for curated real estate guidance, property discovery, and site-visit assistance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-[#C9A84C] text-[#0F1B2D] font-semibold text-sm rounded-lg hover:bg-[#b8953d] transition-all"
            >
              Contact Us Now
            </Link>
            <a
              href="https://wa.me/917060788407"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 border border-white/20 hover:border-[#C9A84C] hover:text-[#C9A84C] font-semibold text-sm rounded-lg transition-all"
            >
              WhatsApp: 7060788407
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
