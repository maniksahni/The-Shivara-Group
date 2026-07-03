"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// Types & helpers
// ═══════════════════════════════════════════════════════════════════════════════

interface FormState {
  name: string;
  phone: string;
  budget: string;
  propertyType: string;
  preferredLocation: string;
}

const budgetOptions = [
  "Under ₹10 Lakh",
  "₹10 – 20 Lakh",
  "₹20 – 40 Lakh",
  "₹40 – 60 Lakh",
  "₹60 Lakh – 1 Crore",
  "Above ₹1 Crore",
];

const propertyTypeOptions = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "VILLA", label: "Villa" },
  { value: "PLOT", label: "Plot / Land" },
  { value: "COMMERCIAL", label: "Commercial Space" },
  { value: "FARMHOUSE", label: "Farmhouse" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HeroSection
// ═══════════════════════════════════════════════════════════════════════════════
function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after mount
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="
        relative min-h-screen flex flex-col items-center justify-center
        overflow-hidden
      "
      aria-label="Hero section"
    >
      {/* ── Background: deep navy layered gradient ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0a1220 0%, #0F1B2D 40%, #162236 70%, #0a1220 100%)",
        }}
      />

      {/* ── Subtle geometric pattern overlay ── */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, #C9A84C 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #C9A84C 0%, transparent 40%),
            radial-gradient(circle at 60% 80%, #C9A84C 0%, transparent 35%)
          `,
        }}
      />

      {/* ── Gold gradient line (decorative) ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background:
            "linear-gradient(90deg, transparent, #C9A84C 30%, #C9A84C 70%, transparent)",
        }}
      />

      {/* ── Floating city silhouette (CSS art) ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10 flex items-end justify-center overflow-hidden">
        <svg viewBox="0 0 1200 120" className="w-full" fill="#C9A84C">
          <rect x="50" y="60" width="30" height="60" />
          <rect x="90" y="40" width="20" height="80" />
          <rect x="120" y="20" width="40" height="100" />
          <rect x="170" y="50" width="25" height="70" />
          <rect x="205" y="30" width="35" height="90" />
          <rect x="250" y="55" width="20" height="65" />
          <rect x="280" y="10" width="50" height="110" />
          <rect x="340" y="35" width="30" height="85" />
          <rect x="380" y="45" width="25" height="75" />
          <rect x="415" y="25" width="40" height="95" />
          <rect x="465" y="50" width="20" height="70" />
          <rect x="495" y="5" width="60" height="115" />
          <rect x="565" y="30" width="35" height="90" />
          <rect x="610" y="40" width="25" height="80" />
          <rect x="645" y="15" width="45" height="105" />
          <rect x="700" y="45" width="20" height="75" />
          <rect x="730" y="25" width="40" height="95" />
          <rect x="780" y="55" width="25" height="65" />
          <rect x="815" y="20" width="50" height="100" />
          <rect x="875" y="40" width="30" height="80" />
          <rect x="915" y="50" width="20" height="70" />
          <rect x="945" y="30" width="40" height="90" />
          <rect x="995" y="55" width="25" height="65" />
          <rect x="1030" y="15" width="50" height="105" />
          <rect x="1090" y="40" width="30" height="80" />
          <rect x="1130" y="60" width="25" height="60" />
        </svg>
      </div>

      {/* ── Main content ── */}
      <div
        className={`
          relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8
          text-center
          transition-all duration-1000 ease-out
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
      >
        {/* Eyebrow label */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="block h-px w-12 bg-[#C9A84C]" />
          <span className="text-[#C9A84C] text-xs font-medium tracking-[0.3em] uppercase">
            Bareilly · Delhi NCR
          </span>
          <span className="block h-px w-12 bg-[#C9A84C]" />
        </div>

        {/* Main heading */}
        <h1
          className="
            font-[family-name:var(--font-playfair)]
            text-4xl sm:text-5xl md:text-6xl lg:text-7xl
            font-bold text-white
            leading-tight mb-6
          "
        >
          Bespoke Real Estate{" "}
          <span className="text-[#C9A84C] italic">Strategies</span>
          <br className="hidden sm:block" />
          Defining Legacies
        </h1>

        {/* Subheading */}
        <p
          className="
            text-white/70 text-lg sm:text-xl
            max-w-2xl mx-auto leading-relaxed mb-10
            font-[family-name:var(--font-inter)]
          "
        >
          The Shivara Group curates premium real estate opportunities across
          Bareilly and Delhi NCR — defining legacies, one address at a time.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/properties"
            className="
              inline-flex items-center gap-2
              px-8 py-4 rounded-lg
              bg-[#C9A84C] text-[#0F1B2D]
              text-base font-semibold
              hover:bg-[#b8953d] hover:scale-105
              transition-all duration-300 shadow-lg shadow-[#C9A84C]/20
              group
            "
          >
            Explore Properties
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </Link>

          <Link
            href="/contact#site-visit"
            className="
              inline-flex items-center gap-2
              px-8 py-4 rounded-lg
              border-2 border-white/40 text-white
              text-base font-semibold
              hover:border-[#C9A84C] hover:text-[#C9A84C] hover:scale-105
              transition-all duration-300
            "
          >
            Book a Site Visit
          </Link>
        </div>

        {/* Floating stats */}
        <div
          className="
            inline-flex flex-wrap items-center justify-center
            gap-x-8 gap-y-3
            px-8 py-4 rounded-2xl
            bg-white/5 backdrop-blur-sm
            border border-white/10
          "
        >
          {[
            { value: "Bareilly", label: "Primary Market" },
            { value: "Delhi NCR", label: "Advisory Reach" },
            { value: "Aurika", label: "Featured Project" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && (
                <span className="hidden sm:block h-6 w-px bg-white/20" />
              )}
              <div className="text-center">
                <span className="block text-[#C9A84C] font-bold text-lg font-[family-name:var(--font-playfair)]">
                  {stat.value}
                </span>
                <span className="block text-white/60 text-xs">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/40 text-xs tracking-widest uppercase">
          Scroll
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-5 h-5 text-[#C9A84C]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// StatsBar — animated count-up on scroll
// ═══════════════════════════════════════════════════════════════════════════════
function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);

  return count;
}

function StatItem({
  value,
  suffix,
  label,
  active,
}: {
  value: number;
  suffix: string;
  label: string;
  active: boolean;
}) {
  const count = useCountUp(value, 1500, active);
  return (
    <div className="text-center px-6 py-4">
      <div className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-[#C9A84C] mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-white/60 text-sm font-medium uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: 2, suffix: "", label: "Markets: Bareilly + Delhi NCR" },
    { value: 1, suffix: "", label: "Verified Instagram Profile" },
    { value: 6, suffix: "+", label: "Public Project Highlights" },
    { value: 1, suffix: "", label: "Confirmed Contact Number" },
  ];

  return (
    <section
      ref={ref}
      className="bg-[#0F1B2D] py-16"
      aria-label="Company statistics"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x-0 lg:divide-x divide-white/10">
          {stats.map((s, i) => (
            <StatItem key={i} {...s} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FeaturedProperties
// ═══════════════════════════════════════════════════════════════════════════════

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  type: string;
  typeColor: string;
  beds?: number;
  baths?: number;
  area: string;
  description: string;
}

const featuredProperties: Property[] = [
  {
    id: 1,
    title: "Aurika The Residences",
    location: "Bareilly",
    price: "Contact for pricing",
    type: "Luxury Residences",
    typeColor: "bg-blue-100 text-blue-700",
    beds: 3,
    baths: 2,
    area: "Floor plans on request",
    description:
      "Public Instagram content highlights Aurika / The Residences as a premium Bareilly project with site visits available through The Shivara Group.",
  },
  {
    id: 2,
    title: "Amara Villas by Aurika",
    location: "Bareilly",
    price: "Contact for pricing",
    type: "Villa Community",
    typeColor: "bg-green-100 text-green-700",
    area: "Details on request",
    description:
      "A premium villa project publicly referenced by The Shivara Group. Contact the team for pricing, floor plans, and site visit details.",
  },
  {
    id: 3,
    title: "King’s Crest / Gated Villa Options",
    location: "Dohra Road & Bareilly",
    price: "Contact for pricing",
    type: "Villas",
    typeColor: "bg-orange-100 text-orange-700",
    area: "Details on request",
    description:
      "Instagram posts reference gated villa communities and 3BHK homes in Bareilly. Exact inventory and pricing should be confirmed manually.",
  },
];

function PropertyCard({
  property,
  onEnquire,
}: {
  property: Property;
  onEnquire: () => void;
}) {
  return (
    <div
      className="
        bg-white rounded-2xl overflow-hidden shadow-md
        hover:shadow-xl hover:-translate-y-1
        transition-all duration-400 ease-out
        group border border-gray-100
      "
    >
      {/* Image placeholder — gold gradient */}
      <div
        className="
          relative h-52 overflow-hidden
        "
        style={{
          background:
            "linear-gradient(135deg, #0F1B2D 0%, #1a2d4a 40%, #C9A84C30 100%)",
        }}
      >
        {/* Decorative building illustration */}
        <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-30">
          <svg viewBox="0 0 200 100" className="w-48 h-24 text-[#C9A84C]" fill="currentColor">
            <rect x="20" y="30" width="25" height="70" />
            <rect x="55" y="10" width="40" height="90" />
            <rect x="105" y="20" width="30" height="80" />
            <rect x="145" y="40" width="20" height="60" />
            <rect x="170" y="25" width="15" height="75" />
          </svg>
        </div>

        {/* Type badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${property.typeColor}`}
          >
            {property.type}
          </span>
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-4 right-4 bg-[#C9A84C] text-[#0F1B2D] px-3 py-1.5 rounded-lg">
          <span className="font-[family-name:var(--font-playfair)] font-bold text-lg">
            {property.price}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5">
        <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#0F1B2D] mb-1 group-hover:text-[#C9A84C] transition-colors duration-300">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-[#C9A84C]"
          >
            <path
              fillRule="evenodd"
              d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
              clipRule="evenodd"
            />
          </svg>
          {property.location}
        </div>

        {/* Details row */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          {property.beds && (
            <span className="flex items-center gap-1">
              🛏 {property.beds} Beds
            </span>
          )}
          {property.baths && (
            <span className="flex items-center gap-1">
              🚿 {property.baths} Baths
            </span>
          )}
          <span className="flex items-center gap-1">📐 {property.area}</span>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2">
          {property.description}
        </p>

        <button
          onClick={onEnquire}
          className="
            w-full py-2.5 px-4 rounded-lg
            bg-[#0F1B2D] text-white text-sm font-semibold
            hover:bg-[#C9A84C] hover:text-[#0F1B2D]
            transition-all duration-300
          "
        >
          Enquire Now
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Lead Enquiry Section
// ═══════════════════════════════════════════════════════════════════════════════
function EnquirySection() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    budget: "",
    propertyType: "",
    preferredLocation: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and Phone are required.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "WEBSITE",
          status: "NEW",
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="py-20 bg-[#F8F7F4]"
      id="enquiry"
      aria-label="Enquiry form"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Marketing copy */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="block h-0.5 w-10 bg-[#C9A84C]" />
              <span className="text-[#C9A84C] text-xs font-medium tracking-[0.3em] uppercase">
                Free Consultation
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-[#0F1B2D] mb-6 leading-tight">
              Let Us Help You Find the{" "}
              <span className="text-[#C9A84C]">Perfect Property</span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Tell us what you are looking for in Bareilly or Delhi NCR. The
              Shivara Group will help you plan the next step, from property
              discovery to site-visit coordination.
            </p>

            {/* USP list */}
            <ul className="space-y-4">
              {[
                "No obligation — 100% free consultation",
                "Bespoke real estate strategy",
                "Luxury homes, plots, and portfolio guidance",
                "Site visits available by appointment",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#C9A84C]/20 flex items-center justify-center mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3 h-3 text-[#C9A84C]"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-700 text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Enquiry form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 text-green-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#0F1B2D] mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600 text-sm">
                  We&apos;ve received your enquiry. Our team will contact you
                  within 24 hours.
                </p>
                <a
                  href="https://wa.me/917060788407"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white text-sm font-semibold rounded-lg hover:bg-[#1ebe59] transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </div>
            ) : (
              <>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#0F1B2D] mb-6">
                  Get Free Consultation
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="enquiry-name"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="enquiry-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="
                        w-full px-4 py-3 rounded-lg border border-gray-200
                        focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C]
                        text-gray-800 text-sm placeholder-gray-400
                        transition-colors duration-200
                      "
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="enquiry-phone"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="enquiry-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="
                        w-full px-4 py-3 rounded-lg border border-gray-200
                        focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C]
                        text-gray-800 text-sm placeholder-gray-400
                        transition-colors duration-200
                      "
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label
                      htmlFor="enquiry-budget"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Budget Range
                    </label>
                    <select
                      id="enquiry-budget"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      className="
                        w-full px-4 py-3 rounded-lg border border-gray-200
                        focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C]
                        text-gray-800 text-sm
                        transition-colors duration-200 bg-white
                      "
                    >
                      <option value="">Select your budget</option>
                      {budgetOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Property Type */}
                  <div>
                    <label
                      htmlFor="enquiry-propertyType"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Property Type
                    </label>
                    <select
                      id="enquiry-propertyType"
                      name="propertyType"
                      value={form.propertyType}
                      onChange={handleChange}
                      className="
                        w-full px-4 py-3 rounded-lg border border-gray-200
                        focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C]
                        text-gray-800 text-sm
                        transition-colors duration-200 bg-white
                      "
                    >
                      <option value="">Select property type</option>
                      {propertyTypeOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Location */}
                  <div>
                    <label
                      htmlFor="enquiry-preferredLocation"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Preferred Location
                    </label>
                    <input
                      id="enquiry-preferredLocation"
                      name="preferredLocation"
                      type="text"
                      value={form.preferredLocation}
                      onChange={handleChange}
                      placeholder="e.g. Civil Lines, Cantt, Pilibhit Road"
                      className="
                        w-full px-4 py-3 rounded-lg border border-gray-200
                        focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C]
                        text-gray-800 text-sm placeholder-gray-400
                        transition-colors duration-200
                      "
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="
                      w-full py-4 px-6 rounded-lg
                      bg-[#C9A84C] text-[#0F1B2D]
                      font-semibold text-base
                      hover:bg-[#b8953d] disabled:opacity-60 disabled:cursor-not-allowed
                      transition-colors duration-300
                      flex items-center justify-center gap-2
                    "
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Submitting…
                      </>
                    ) : (
                      "Get Free Consultation"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WhyChooseUs
// ═══════════════════════════════════════════════════════════════════════════════

const reasons = [
  {
    icon: "🏆",
    title: "Bespoke Strategy",
    description:
      "Curated real estate guidance for buyers, investors, and families planning their next address.",
  },
  {
    icon: "😊",
    title: "Bareilly & Delhi NCR",
    description:
      "Public brand communication highlights Bareilly and Delhi NCR as the company's active markets.",
  },
  {
    icon: "🎁",
    title: "Site-Visit Led Discovery",
    description:
      "Public captions repeatedly invite users to call for pricing, floor plans, and physical site visits.",
  },
  {
    icon: "🔍",
    title: "Transparent Deals",
    description:
      "Pricing, floor plans, inventory, and legal details should be verified directly before every booking decision.",
  },
  {
    icon: "📍",
    title: "Prime Locations",
    description:
      "Access to exclusive inventory across Bareilly's most sought-after localities and emerging micro-markets.",
  },
  {
    icon: "🤝",
    title: "After-Sale Support",
    description:
      "Our relationship doesn't end at the sale. We support you through paperwork, registration, and beyond.",
  },
];

function WhyChooseUs() {
  return (
    <section className="py-20 bg-white" aria-label="Why choose us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="block h-0.5 w-10 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs font-medium tracking-[0.3em] uppercase">
              Our Advantage
            </span>
            <span className="block h-0.5 w-10 bg-[#C9A84C]" />
          </div>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-[#0F1B2D]">
            Why Choose The Shivara Group?
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="
                p-6 rounded-2xl border border-gray-100
                hover:border-[#C9A84C]/30 hover:shadow-lg hover:-translate-y-1
                transition-all duration-300 bg-[#F8F7F4]
                group
              "
            >
              <div className="text-3xl mb-4">{r.icon}</div>
              <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#0F1B2D] mb-2 group-hover:text-[#C9A84C] transition-colors duration-300">
                {r.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Testimonials
// ═══════════════════════════════════════════════════════════════════════════════

const testimonials = [
  {
    name: "Manual Completion Required",
    role: "Customer Testimonials",
    rating: 0,
    text: "Public customer testimonials were not visible from the available Instagram profile snippets. Add verified client testimonials here after approval.",
    initials: "MC",
  },
  {
    name: "Public Source Used",
    role: "Instagram Profile",
    rating: 0,
    text: "Website copy is aligned with public Instagram messaging: bespoke real estate strategies, Bareilly + Delhi NCR, Aurika, villas, plots, pricing/floor plans/site visits.",
    initials: "IG",
  },
  {
    name: "Verification Needed",
    role: "Before Publishing Testimonials",
    rating: 0,
    text: "Do not publish invented customer names or quotes. Replace this card only with real reviews supplied by the company or publicly visible testimonials.",
    initials: "VN",
  },
];

function Testimonials() {
  return (
    <section className="py-20 bg-[#F8F7F4]" aria-label="Client testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="block h-0.5 w-10 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs font-medium tracking-[0.3em] uppercase">
              Client Stories
            </span>
            <span className="block h-0.5 w-10 bg-[#C9A84C]" />
          </div>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-[#0F1B2D]">
            What Our Clients Say
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="
                bg-white rounded-2xl p-6 shadow-sm border border-gray-100
                hover:shadow-md hover:-translate-y-1
                transition-all duration-300
              "
            >
              {/* Star rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: Math.max(t.rating, 1) }).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-[#C9A84C]"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#0F1B2D] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C9A84C] text-sm font-bold font-[family-name:var(--font-playfair)]">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-[#0F1B2D] text-sm">
                    {t.name}
                  </p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CTA Banner
// ═══════════════════════════════════════════════════════════════════════════════
function CTABanner() {
  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0F1B2D 0%, #1a2d4a 50%, #0F1B2D 100%)",
      }}
      aria-label="Call to action"
    >
      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

      {/* Radial glow */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: "radial-gradient(ellipse at center, #C9A84C 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="block h-0.5 w-10 bg-[#C9A84C]" />
          <span className="text-[#C9A84C] text-xs font-medium tracking-[0.3em] uppercase">
            Get Started Today
          </span>
          <span className="block h-0.5 w-10 bg-[#C9A84C]" />
        </div>

        <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          Ready to Find Your{" "}
          <span className="text-[#C9A84C]">Perfect Property?</span>
        </h2>

        <p className="text-white/70 text-base sm:text-lg mb-10 leading-relaxed">
          Take the first step toward your dream home. Book a site visit today
          and let our experts guide you through Bareilly&apos;s finest
          properties.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact#site-visit"
            className="
              inline-flex items-center gap-2
              px-8 py-4 rounded-lg
              bg-[#C9A84C] text-[#0F1B2D]
              text-base font-semibold
              hover:bg-[#b8953d] hover:scale-105
              transition-all duration-300 shadow-lg shadow-[#C9A84C]/20
            "
          >
            Book a Site Visit
          </Link>
          <a
            href="tel:+917060788407"
            className="
              inline-flex items-center gap-2
              px-8 py-4 rounded-lg
              border-2 border-white/40 text-white
              text-base font-semibold
              hover:border-[#C9A84C] hover:text-[#C9A84C]
              transition-all duration-300
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                clipRule="evenodd"
              />
            </svg>
            +91 7060788407
          </a>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Quick Enquiry Modal (used from Featured Properties)
// ═══════════════════════════════════════════════════════════════════════════════
function QuickEnquiryModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and Phone are required.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "WEBSITE", status: "NEW" }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#0F1B2D] mb-2">
              Enquiry Sent!
            </h3>
            <p className="text-gray-600 text-sm">
              Our team will call you within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-[#C9A84C] text-[#0F1B2D] text-sm font-semibold rounded-lg hover:bg-[#b8953d] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#0F1B2D] mb-2">
              Enquire About This Property
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Leave your details and we&apos;ll get back to you shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] text-sm"
                />
              </div>
              {error && (
                <p className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#C9A84C] text-[#0F1B2D] font-semibold rounded-lg hover:bg-[#b8953d] disabled:opacity-60 transition-colors"
              >
                {submitting ? "Sending…" : "Send Enquiry"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HomePage — assembles all sections
// ═══════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Stats bar */}
      <StatsBar />

      {/* 3. Featured Properties */}
      <section className="py-20 bg-[#F8F7F4]" aria-label="Featured properties">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="block h-0.5 w-10 bg-[#C9A84C]" />
              <span className="text-[#C9A84C] text-xs font-medium tracking-[0.3em] uppercase">
                Hand-picked
              </span>
              <span className="block h-0.5 w-10 bg-[#C9A84C]" />
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-[#0F1B2D] mb-4">
              Featured Properties
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
              Explore our hand-picked selection of premium properties across
              Bareilly&apos;s most desirable locations.
            </p>
          </div>

          {/* Property cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEnquire={() => setShowModal(true)}
              />
            ))}
          </div>

          {/* View all */}
          <div className="text-center">
            <Link
              href="/properties"
              className="
                inline-flex items-center gap-2
                px-8 py-3.5 rounded-lg
                border-2 border-[#0F1B2D] text-[#0F1B2D]
                text-sm font-semibold
                hover:bg-[#0F1B2D] hover:text-white
                transition-all duration-300 group
              "
            >
              View All Properties
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Enquiry Section */}
      <EnquirySection />

      {/* 5. Why Choose Us */}
      <WhyChooseUs />

      {/* 6. Testimonials */}
      <Testimonials />

      {/* 7. CTA Banner */}
      <CTABanner />

      {/* Quick Enquiry Modal */}
      {showModal && (
        <QuickEnquiryModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
