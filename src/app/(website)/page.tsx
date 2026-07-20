import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Eyebrow,
  GoldDivider,
  LuxuryButton,
  SectionHeader,
  SectionShell,
} from "@/components/website/LuxurySection";
import FloatingEnquiryCard from "@/components/website/FloatingEnquiryCard";
import PropertyMatchFinder from "@/components/website/PropertyMatchFinder";
import {
  categoryShowcase,
  credibilityCards,
  fallbackProperties,
  faqs,
  bareillyGuide,
  investmentHighlights,
  partnerPlaceholders,
  processSteps,
  publicStats,
  searchSuggestions,
  services,
  siteConfig,
  testimonials,
  trustEngine,
  trustHighlights,
} from "@/components/website/site-data";

const heroImage =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80";
const villaImage =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80";
const interiorImage =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80";

export default function HomePage() {
  return (
    <main className="bg-[#F8F5EE]">
      <section className="relative min-h-[92svh] overflow-hidden bg-[#081120] px-4 pb-7 pt-[5.25rem] text-white sm:min-h-[100svh] sm:px-8 sm:pb-12 sm:pt-28 lg:px-12">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(8,17,32,0.96), rgba(8,17,32,0.78), rgba(8,17,32,0.28)), url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(212,175,55,0.26),transparent_34%),radial-gradient(circle_at_78%_18%,rgba(16,185,129,0.18),transparent_30%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#081120] to-transparent" />

        <div className="relative mx-auto grid w-full max-w-7xl min-w-0 items-center gap-5 sm:min-h-[calc(100svh-8rem)] sm:gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="w-full min-w-0 max-w-3xl animate-hero-rise">
            <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-[#D4AF37]/24 bg-white/[0.07] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#F5D67B] shadow-[0_18px_60px_rgba(0,0,0,0.16)] backdrop-blur-xl sm:mb-5 sm:px-4 sm:text-xs sm:tracking-[0.26em]">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Premium real estate in Bareilly</span>
            </div>
            <Eyebrow dark>{siteConfig.tagline}</Eyebrow>
            <h1 className="max-w-[13ch] text-balance font-[family-name:var(--font-playfair)] text-[clamp(2.55rem,11.5vw,3.65rem)] font-semibold leading-[0.94] tracking-[-0.055em] sm:max-w-none sm:text-[clamp(4.6rem,8vw,7.8rem)] sm:leading-[0.92] sm:tracking-[-0.075em]">
              Find Your Perfect Property With Bareilly&apos;s Trusted Real Estate Experts.
            </h1>
            <p className="mt-3 max-w-[31rem] text-[15px] leading-6 text-white/76 sm:mt-7 sm:max-w-2xl sm:text-xl sm:leading-8">
              Discover verified residential, commercial, and investment properties with expert
              guidance, site visits, loan support, and complete documentation assistance.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 sm:mt-6">
              {["Verified properties", "Site visit support", "Loan assistance"].map((item) => (
                <span
                  key={item}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.065] px-3 text-[11px] font-bold text-white/78 backdrop-blur"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-4 grid w-full max-w-[28rem] grid-cols-2 gap-2 sm:mt-9 sm:flex sm:max-w-none sm:flex-row sm:gap-3">
              <LuxuryButton href="/properties" className="col-span-2 w-full sm:w-auto">Explore Properties</LuxuryButton>
              <LuxuryButton href="/#property-match-finder" variant="outline" className="w-full px-3 text-[10px] tracking-[0.06em] sm:w-auto sm:px-6 sm:text-sm sm:tracking-[0.16em]">
                Free Consultation
              </LuxuryButton>
              <a
                href={siteConfig.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 max-w-full items-center justify-center gap-2 rounded-full bg-[#10B981] px-3 text-center text-[11px] font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_45px_rgba(16,185,129,0.24)] transition-all duration-300 hover:-translate-y-0.5 sm:px-6 sm:text-sm sm:tracking-[0.16em]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>

            <div className="mt-4 hidden w-full max-w-[28rem] overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/[0.075] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:mt-8 sm:block sm:max-w-2xl sm:rounded-[1.75rem] sm:p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <div className="flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-2xl bg-white px-4 text-[#081120]">
                  <Search className="h-5 w-5 shrink-0 text-[#9B7A19]" />
                  <span className="min-w-0 truncate text-sm font-bold text-[#4B5563]">
                    Search by project, location, villa, plot...
                  </span>
                </div>
                <Link
                  href="/#property-match-finder"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-5 text-xs font-black uppercase tracking-[0.12em] text-[#081120] transition hover:bg-[#F5D67B] sm:text-sm sm:tracking-[0.14em]"
                >
                  Find Match
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1 sm:mt-3">
                {searchSuggestions.map((item) => (
                  <Link
                    key={item}
                    href={`/properties?q=${encodeURIComponent(item)}`}
                    className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-white/70 transition hover:border-[#D4AF37]/60 hover:text-[#F5D67B]"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 w-full max-w-[30rem] lg:hidden">
              <FloatingEnquiryCard />
            </div>

            <div className="premium-scrollbar mt-3 flex snap-x gap-2 overflow-x-auto pb-1 sm:mt-10 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible sm:pb-0">
              {publicStats.map((stat) => (
                <div
                  key={stat.label}
                  className="touch-lift min-w-[7.65rem] snap-start rounded-2xl border border-white/10 bg-white/[0.055] p-3 backdrop-blur sm:min-w-0 sm:rounded-3xl sm:p-4"
                >
                  <p className="font-[family-name:var(--font-playfair)] text-[1.55rem] font-semibold leading-none text-[#F5D67B] sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/72 sm:text-xs sm:tracking-[0.14em]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden animate-hero-rise lg:block" style={{ animationDelay: "120ms" }}>
            <div className="absolute -left-16 top-8 z-10 w-[420px]">
              <FloatingEnquiryCard />
            </div>

            <div className="ml-auto h-[640px] max-w-[520px] rounded-[3rem] border border-white/12 bg-cover bg-center shadow-[0_40px_120px_rgba(0,0,0,0.42)]"
              style={{ backgroundImage: `url(${villaImage})` }}
            />
            <div className="absolute -bottom-8 right-12 w-80 rounded-[2rem] border border-[#D4AF37]/28 bg-[#081120]/88 p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-[#F5D67B]">
                  Featured
                </p>
                <Heart className="h-5 w-5 text-[#F5D67B]" />
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-playfair)] text-2xl font-semibold">
                Premium Bareilly Shortlist
              </h3>
              <p className="mt-2 flex items-center gap-2 text-sm text-white/62">
                <MapPin className="h-4 w-4 text-[#D4AF37]" />
                Homes • plots • commercial • investment
              </p>
            </div>
          </div>
        </div>

        <a
          href="#curated"
          className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-white/58 transition hover:text-white md:flex"
        >
          Scroll
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </a>
      </section>

      <GoldDivider />

      <SectionShell className="bg-[#081120] py-5 text-white sm:py-8">
        <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-6">
          {trustHighlights.map((item) => (
            <div
              key={item}
              className="touch-lift flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.045] p-3.5 sm:p-4"
            >
              <BadgeCheck className="h-5 w-5 shrink-0 text-[#D4AF37]" />
              <span className="text-sm font-semibold text-white/74">{item}</span>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-[#F8F5EE]">
        <PropertyMatchFinder />
      </SectionShell>

      <SectionShell id="curated">
        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <SectionHeader
            eyebrow="Curated inventory"
            title="A sharper way to discover premium property."
            description="Property discovery should feel calm, informed, and curated — not chaotic. Start with public highlights, then verify pricing, inventory, and site visits directly with the team."
          />
          <div className="rounded-[1.5rem] border border-[#D4AF37]/24 bg-white p-3.5 shadow-[0_24px_70px_rgba(8,17,32,0.08)] sm:rounded-[2rem] sm:p-5">
            <div
              className="h-52 rounded-[1.2rem] bg-cover bg-center sm:h-72 sm:rounded-[1.5rem]"
              style={{ backgroundImage: `url(${interiorImage})` }}
            />
            <div className="grid gap-2 pt-3 sm:grid-cols-3 sm:gap-3 sm:pt-4">
              {["Verified calls", "Site visit slots", "CRM follow-ups"].map((item) => (
                <div key={item} className="rounded-2xl bg-[#F8F5EE] p-3 text-sm font-bold sm:p-4">
                  <CheckCircle2 className="mb-1.5 h-5 w-5 text-[#10B981] sm:mb-2" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="premium-scrollbar mt-8 flex snap-x gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-3">
          {fallbackProperties.slice(0, 3).map((property, index) => (
            <article
              key={property.id}
              className="touch-lift group w-[86vw] shrink-0 snap-center overflow-hidden rounded-[1.6rem] border border-[#081120]/8 bg-white shadow-[0_24px_70px_rgba(8,17,32,0.08)] transition duration-500 hover:shadow-[0_32px_90px_rgba(8,17,32,0.16)] sm:w-[420px] sm:rounded-[2rem] md:w-auto"
            >
              <Link href={`/properties/${property.id}`} className="block">
                <div
                  className="relative h-56 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03] sm:h-72"
                  style={{
                    backgroundImage: `linear-gradient(180deg,rgba(8,17,32,0.04),rgba(8,17,32,0.62)), url(${
                      index === 1 ? villaImage : heroImage
                    })`,
                  }}
                >
                  <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#081120]">
                    {property.type.replace("_", " ")}
                  </div>
                  {property.isFeatured && (
                    <div className="absolute right-4 top-4 rounded-full bg-[#D4AF37] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#081120]">
                      Featured
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F5D67B]">
                      {property.price}
                    </p>
                    <h3 className="mt-1.5 font-[family-name:var(--font-playfair)] text-2xl font-semibold sm:mt-2 sm:text-3xl">
                      {property.title}
                    </h3>
                  </div>
                </div>
              </Link>
              <div className="p-4 sm:p-6">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#4B5563]">
                  <MapPin className="h-4 w-4 text-[#D4AF37]" />
                  {property.location}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#10B981]">
                  <BadgeCheck className="h-4 w-4" />
                  Visit-ready enquiry
                </div>
                <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                  {property.amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full bg-[#F8F5EE] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#4B5563]"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-[1fr_auto_auto]">
                  <Link
                    href={`/properties/${property.id}`}
                    className="col-span-2 inline-flex min-h-11 items-center justify-center rounded-full bg-[#081120] px-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#D4AF37] hover:text-[#081120] sm:col-span-1"
                  >
                    View Details
                  </Link>
                  <a
                    href={siteConfig.phoneHref}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#F8F5EE] text-xs font-black text-[#081120] sm:w-11"
                    aria-label={`Call for ${property.title}`}
                  >
                    <Phone className="h-4 w-4" />
                    <span className="sm:hidden">Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                      `Hi The Shivara Group, I am interested in ${property.title}. Please share details.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#10B981] text-xs font-black text-white sm:w-11"
                    aria-label={`WhatsApp for ${property.title}`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="sm:hidden">WhatsApp</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-white">
        <SectionHeader
          eyebrow="Property universe"
          title="Browse like a premium buyer, not a spreadsheet."
          description="A flagship real estate experience should make categories feel visual, focused, and easy to act on from mobile."
          align="center"
        />
        <div className="grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-4">
          {categoryShowcase.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="touch-lift group relative min-h-[260px] overflow-hidden rounded-[1.6rem] bg-[#081120] shadow-[0_24px_70px_rgba(8,17,32,0.12)] sm:min-h-[420px] sm:rounded-[2.2rem]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(180deg,rgba(8,17,32,0.08),rgba(8,17,32,0.86)),url(${category.image})`,
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.24),transparent_34%)]" />
              <div className="relative flex h-full min-h-[260px] flex-col justify-end p-4 text-white sm:min-h-[420px] sm:p-6">
                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#F5D67B]">
                  Explore
                </p>
                <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-[-0.03em]">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/66 sm:mt-3 sm:leading-7">{category.description}</p>
                <span className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#081120] transition group-hover:bg-[#D4AF37] sm:mt-6 sm:h-11 sm:w-11">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-[#081120] text-white">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <SectionHeader
            eyebrow="Bareilly Property Guide"
            title="Explore Bareilly’s most promising property locations."
            description="The Shivara experience positions every enquiry around location fit, lifestyle, investment intent, and site-visit readiness."
            dark
          />
          <div className="grid gap-3 md:grid-cols-2">
            {bareillyGuide.map((item) => (
              <div
                key={item.zone}
                className="touch-lift rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.18)] sm:rounded-[2rem] sm:p-5"
              >
                <MapPin className="h-5 w-5 text-[#D4AF37]" />
                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-[#F5D67B]">
                  {item.signal}
                </p>
                <h3 className="mt-2 text-xl font-black">{item.zone}</h3>
                <p className="mt-3 text-sm leading-7 text-white/62">{item.insight}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell className="bg-white">
          <SectionHeader
            eyebrow="Premium services"
            title="Built for high-intent buyers, investors, and families."
          description="Every service is designed around a real outcome: shortlist faster, visit confidently, and move forward with verified information."
          align="center"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="touch-lift group rounded-[1.6rem] border border-[#081120]/8 bg-[#F8F5EE] p-4 transition duration-300 hover:bg-[#081120] hover:text-white sm:rounded-[2rem] sm:p-6"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37] text-[#081120] sm:mb-8 sm:h-12 sm:w-12">
                {index % 3 === 0 ? (
                  <Home className="h-5 w-5" />
                ) : index % 3 === 1 ? (
                  <CalendarDays className="h-5 w-5" />
                ) : (
                  <ShieldCheck className="h-5 w-5" />
                )}
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#4B5563] transition group-hover:text-white/68 sm:mt-3 sm:min-h-24 sm:leading-7">
                {service.description}
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#9B7A19] transition group-hover:text-[#F5D67B] sm:mt-5"
              >
                {service.cta}
                <Sparkles className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-[#F8F5EE]">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <SectionHeader
            eyebrow="Investment lens"
            title="Property decisions need a stronger point of view."
            description="The site now frames opportunities around location, asset type, and use-case clarity — without inventing returns or fake promises."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {investmentHighlights.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.6rem] border border-[#081120]/8 bg-white p-4 shadow-[0_20px_60px_rgba(8,17,32,0.06)] sm:rounded-[2rem] sm:p-6"
              >
                <TrendingUp className="h-7 w-7 text-[#9B7A19]" />
                <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-[#9B7A19] sm:mt-8">
                  {item.metric}
                </p>
                <h3 className="mt-2 text-xl font-black text-[#081120]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#4B5563]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell className="bg-white">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="overflow-hidden rounded-[2rem] bg-[#081120] p-5 text-white shadow-[0_28px_90px_rgba(8,17,32,0.18)] sm:rounded-[2.5rem] sm:p-8">
            <div
              className="mb-5 h-56 rounded-[1.5rem] bg-cover bg-center sm:h-72"
              style={{ backgroundImage: `linear-gradient(180deg,rgba(8,17,32,0.02),rgba(8,17,32,0.58)),url(${villaImage})` }}
            />
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#D4AF37]">
              Trust Engine
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-4xl font-semibold leading-tight sm:text-5xl">
              Every step should feel verified, guided, and human.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {trustEngine.map((item) => (
              <div key={item} className="rounded-[1.45rem] border border-[#081120]/8 bg-[#F8F5EE] p-4 sm:rounded-[1.75rem] sm:p-5">
                <ShieldCheck className="h-6 w-6 text-[#10B981]" />
                <p className="mt-4 text-base font-black text-[#081120]">{item}</p>
              </div>
            ))}
            <a
              href={siteConfig.phoneHref}
              className="rounded-[1.45rem] bg-[#D4AF37] p-4 text-[#081120] shadow-[0_20px_50px_rgba(212,175,55,0.22)] sm:rounded-[1.75rem] sm:p-5"
            >
              <Users className="h-6 w-6" />
              <p className="mt-4 text-base font-black">Talk to a dedicated consultant</p>
            </a>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="bg-[#081120] text-white">
        <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <SectionHeader
            eyebrow="Property journey"
            title="A smoother path from requirement to final booking."
            description="Every enquiry is guided through shortlisting, site visits, negotiation, loan support, documentation, and booking clarity."
            dark
          />
          <div className="grid gap-4">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="grid gap-3 rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-4 sm:grid-cols-[90px_1fr] sm:gap-4 sm:rounded-[2rem] sm:p-5"
              >
                <div className="font-[family-name:var(--font-playfair)] text-5xl font-semibold text-[#D4AF37]">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/62">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell>
        <SectionHeader
          eyebrow="Trust"
          title="Designed to build confidence before the first call."
          description="A premium property journey should feel clear, calm, and easy to verify before a buyer schedules a visit."
          align="center"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.quote}
              className="rounded-[1.6rem] border border-[#081120]/8 bg-white p-4 shadow-[0_20px_60px_rgba(8,17,32,0.06)] sm:rounded-[2rem] sm:p-6"
            >
              <div className="mb-3 flex gap-1 text-[#D4AF37] sm:mb-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-base leading-7 text-[#1F2937] sm:text-lg sm:leading-8">“{testimonial.quote}”</p>
              <p className="mt-4 font-bold text-[#081120] sm:mt-6">{testimonial.name}</p>
              <p className="text-sm text-[#6B7280]">{testimonial.meta}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-white">
        <SectionHeader
          eyebrow="Trust architecture"
          title="Premium does not mean pretending. It means being clear."
          description="Customers trust brands that explain the process clearly and make it simple to confirm every important detail."
          align="center"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {credibilityCards.map((card) => (
            <div key={card.title} className="rounded-[1.6rem] border border-[#081120]/8 bg-[#F8F5EE] p-4 sm:rounded-[2rem] sm:p-6">
              <BadgeCheck className="h-6 w-6 text-[#10B981]" />
              <h3 className="mt-4 text-lg font-black text-[#081120] sm:mt-5">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#4B5563] sm:mt-3 sm:leading-7">{card.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-2.5 rounded-[1.6rem] bg-[#081120] p-4 text-white sm:grid-cols-2 sm:rounded-[2rem] sm:p-5 lg:grid-cols-4">
          {partnerPlaceholders.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-sm font-bold text-white/68">
              {item}
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-white">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <SectionHeader
            eyebrow="FAQ"
            title="Clear answers before you call."
            description="A polished brand also tells buyers what is verified, what is pending, and what needs direct confirmation."
          />
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-[#081120]/8 bg-[#F8F5EE] p-4 open:bg-[#081120] open:text-white sm:rounded-3xl sm:p-5"
              >
                <summary className="cursor-pointer list-none text-base font-bold sm:text-lg">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-[#4B5563] group-open:text-white/68 sm:mt-4 sm:leading-7">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell className="bg-[#F8F5EE] pb-28 md:pb-24">
        <div className="overflow-hidden rounded-[1.75rem] bg-[#081120] p-5 text-white shadow-[0_30px_100px_rgba(8,17,32,0.22)] sm:rounded-[2.4rem] md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#D4AF37] sm:text-xs sm:tracking-[0.34em]">
                Conversion first
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:mt-3 sm:text-6xl">
                Tell us your requirement. We’ll find the right property for you.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/64 sm:mt-5 sm:text-base">
                Call, WhatsApp, or book a site visit. The CRM will capture your enquiry and
                help the team follow up properly.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href={siteConfig.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#10B981] px-6 text-sm font-black uppercase tracking-[0.14em] text-white"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Now
              </a>
              <LuxuryButton href="/contact#site-visit" variant="light">
                Book Free Consultation
              </LuxuryButton>
              <LuxuryButton href="/properties" variant="outline">
                Explore Properties
              </LuxuryButton>
            </div>
          </div>
        </div>
      </SectionShell>
    </main>
  );
}
