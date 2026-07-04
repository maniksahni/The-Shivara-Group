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
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import {
  Eyebrow,
  GoldDivider,
  LuxuryButton,
  SectionHeader,
  SectionShell,
} from "@/components/website/LuxurySection";
import {
  categoryShowcase,
  credibilityCards,
  fallbackProperties,
  faqs,
  investmentHighlights,
  partnerPlaceholders,
  processSteps,
  publicStats,
  searchSuggestions,
  services,
  siteConfig,
  testimonials,
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
      <section className="relative min-h-[100svh] overflow-hidden bg-[#081120] px-5 pb-12 pt-28 text-white sm:px-8 lg:px-12">
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

        <div className="relative mx-auto grid min-h-[calc(100svh-8rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="max-w-3xl">
            <Eyebrow dark>Premium real estate in Bareilly</Eyebrow>
            <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(3.2rem,9vw,7.8rem)] font-semibold leading-[0.9] tracking-[-0.075em]">
              Addresses that feel like arrival.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">
              The Shivara Group curates premium residences, villas, plots, and investment
              opportunities with verified conversations, guided site visits, and a polished
              buyer journey.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <LuxuryButton href="/properties">Explore Properties</LuxuryButton>
              <LuxuryButton href="/contact#site-visit" variant="outline">
                Book Site Visit
              </LuxuryButton>
            </div>

            <div className="mt-8 max-w-2xl rounded-[1.75rem] border border-white/12 bg-white/[0.075] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl bg-white px-4 text-[#081120]">
                  <Search className="h-5 w-5 text-[#9B7A19]" />
                  <span className="text-sm font-bold text-[#4B5563]">
                    Search by project, location, villa, plot...
                  </span>
                </div>
                <Link
                  href="/properties"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-5 text-sm font-black uppercase tracking-[0.14em] text-[#081120] transition hover:bg-[#F5D67B]"
                >
                  Search
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
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

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {publicStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur"
                >
                  <p className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[#F5D67B]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white/72">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -left-8 top-8 z-10 w-72 rounded-[2rem] border border-white/14 bg-white/[0.08] p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37] text-[#081120]">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F5D67B]">
                    Private tour
                  </p>
                  <p className="font-semibold">Site visits by appointment</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/62">
                Share your budget and preferred location. The team coordinates the next available
                visit slot.
              </p>
              <Link
                href="/contact#site-visit"
                className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#081120]"
              >
                Schedule now
              </Link>
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
                Aurika Residences
              </h3>
              <p className="mt-2 flex items-center gap-2 text-sm text-white/62">
                <MapPin className="h-4 w-4 text-[#D4AF37]" />
                Bareilly
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

      <SectionShell className="bg-[#081120] py-8 text-white">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {trustHighlights.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.045] p-4"
            >
              <BadgeCheck className="h-5 w-5 shrink-0 text-[#D4AF37]" />
              <span className="text-sm font-semibold text-white/74">{item}</span>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="curated">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <SectionHeader
            eyebrow="Curated inventory"
            title="A sharper way to discover premium property."
            description="Property discovery should feel calm, informed, and curated — not chaotic. Start with public highlights, then verify pricing, inventory, and site visits directly with the team."
          />
          <div className="rounded-[2rem] border border-[#D4AF37]/24 bg-white p-5 shadow-[0_24px_70px_rgba(8,17,32,0.08)]">
            <div
              className="h-72 rounded-[1.5rem] bg-cover bg-center"
              style={{ backgroundImage: `url(${interiorImage})` }}
            />
            <div className="grid gap-3 pt-4 sm:grid-cols-3">
              {["Verified calls", "Site visit slots", "CRM follow-ups"].map((item) => (
                <div key={item} className="rounded-2xl bg-[#F8F5EE] p-4 text-sm font-bold">
                  <CheckCircle2 className="mb-2 h-5 w-5 text-[#10B981]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {fallbackProperties.slice(0, 3).map((property, index) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group overflow-hidden rounded-[2rem] border border-[#081120]/8 bg-white shadow-[0_24px_70px_rgba(8,17,32,0.08)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_32px_90px_rgba(8,17,32,0.16)]"
            >
              <div
                className="relative h-72 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
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
                  <h3 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl font-semibold">
                    {property.title}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#4B5563]">
                  <MapPin className="h-4 w-4 text-[#D4AF37]" />
                  {property.location}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {property.amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full bg-[#F8F5EE] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#4B5563]"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
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
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {categoryShowcase.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group relative min-h-[420px] overflow-hidden rounded-[2.2rem] bg-[#081120] shadow-[0_24px_70px_rgba(8,17,32,0.12)]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(180deg,rgba(8,17,32,0.08),rgba(8,17,32,0.86)),url(${category.image})`,
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.24),transparent_34%)]" />
              <div className="relative flex h-full min-h-[420px] flex-col justify-end p-6 text-white">
                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#F5D67B]">
                  Explore
                </p>
                <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-[-0.03em]">
                  {category.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/66">{category.description}</p>
                <span className="mt-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#081120] transition group-hover:bg-[#D4AF37]">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-white">
        <SectionHeader
          eyebrow="Services"
          title="Built for high-intent buyers, investors, and families."
          description="Every service is designed around a real outcome: shortlist faster, visit confidently, and move forward with verified information."
          align="center"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group rounded-[2rem] border border-[#081120]/8 bg-[#F8F5EE] p-6 transition duration-300 hover:-translate-y-1 hover:bg-[#081120] hover:text-white"
            >
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37] text-[#081120]">
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
              <p className="mt-3 min-h-24 text-sm leading-7 text-[#4B5563] transition group-hover:text-white/68">
                {service.description}
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#9B7A19] transition group-hover:text-[#F5D67B]"
              >
                {service.cta}
                <Sparkles className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-[#F8F5EE]">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <SectionHeader
            eyebrow="Investment lens"
            title="Property decisions need a stronger point of view."
            description="The site now frames opportunities around location, asset type, and use-case clarity — without inventing returns or fake promises."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {investmentHighlights.map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-[#081120]/8 bg-white p-6 shadow-[0_20px_60px_rgba(8,17,32,0.06)]"
              >
                <TrendingUp className="h-7 w-7 text-[#9B7A19]" />
                <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-[#9B7A19]">
                  {item.metric}
                </p>
                <h3 className="mt-2 text-xl font-black text-[#081120]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#4B5563]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell className="bg-[#081120] text-white">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Process"
            title="From Instagram enquiry to site visit — without confusion."
            description="The public website feeds a CRM-driven enquiry flow so the team can track leads, follow-ups, and visit requests instead of losing conversations across channels."
            dark
          />
          <div className="grid gap-4">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 sm:grid-cols-[90px_1fr]"
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
              className="rounded-[2rem] border border-[#081120]/8 bg-white p-6 shadow-[0_20px_60px_rgba(8,17,32,0.06)]"
            >
              <div className="mb-5 flex gap-1 text-[#D4AF37]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-lg leading-8 text-[#1F2937]">“{testimonial.quote}”</p>
              <p className="mt-6 font-bold text-[#081120]">{testimonial.name}</p>
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
            <div key={card.title} className="rounded-[2rem] border border-[#081120]/8 bg-[#F8F5EE] p-6">
              <BadgeCheck className="h-6 w-6 text-[#10B981]" />
              <h3 className="mt-5 text-lg font-black text-[#081120]">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#4B5563]">{card.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-3 rounded-[2rem] bg-[#081120] p-5 text-white sm:grid-cols-2 lg:grid-cols-4">
          {partnerPlaceholders.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-sm font-bold text-white/68">
              {item}
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-white">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            eyebrow="FAQ"
            title="Clear answers before you call."
            description="A polished brand also tells buyers what is verified, what is pending, and what needs direct confirmation."
          />
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-3xl border border-[#081120]/8 bg-[#F8F5EE] p-5 open:bg-[#081120] open:text-white"
              >
                <summary className="cursor-pointer list-none text-lg font-bold">
                  {faq.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-[#4B5563] group-open:text-white/68">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell className="bg-[#F8F5EE] pb-28 md:pb-24">
        <div className="overflow-hidden rounded-[2.4rem] bg-[#081120] p-8 text-white shadow-[0_30px_100px_rgba(8,17,32,0.22)] md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-[#D4AF37]">
                Conversion first
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
                One conversation can shortlist your next address.
              </h2>
              <p className="mt-5 max-w-2xl text-white/64">
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
                Book Site Visit
              </LuxuryButton>
            </div>
          </div>
        </div>
      </SectionShell>
    </main>
  );
}
