import type { Metadata } from "next";
import { Lock, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/components/website/site-data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and data protection practices of The Shivara Group real estate advisory.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F8F5EE] py-28 px-4 sm:px-8 lg:px-12 text-[#081120]">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[2.4rem] border border-[#081120]/10 bg-white p-7 sm:p-12 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#FFF9E8] px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#9B7A19]">
            <Lock className="h-4 w-4" />
            Data Protection
          </div>

          <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl font-semibold sm:text-5xl text-[#081120]">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs font-semibold text-[#6B7280]">
            Effective Date: September 2026 &bull; The Shivara Group
          </p>

          <div className="mt-8 space-y-6 text-sm leading-7 text-[#4B5563]">
            <section>
              <h2 className="text-lg font-bold text-[#081120]">1. Introduction</h2>
              <p className="mt-2">
                The Shivara Group (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects your personal privacy. This Privacy
                Policy explains what information we collect when you use our website (https://shivara.site), submit
                enquiry forms, or interact with our advisors on WhatsApp or phone, and how that information is
                utilized.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#081120]">2. Information We Collect</h2>
              <p className="mt-2">
                We only collect information voluntarily provided by you when submitting property enquiry forms,
                booking site visits, or requesting consultations:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Full name</li>
                <li>Contact phone number / WhatsApp number</li>
                <li>Email address (optional)</li>
                <li>Property preferences (budget range, preferred locations, property category, timeline)</li>
              </ul>
              <p className="mt-2">
                We do not collect or store financial payment details, credit card numbers, or sensitive identity
                documents through our public website.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#081120]">3. How We Use Your Information</h2>
              <p className="mt-2">
                Your information is exclusively utilized to:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Respond to your property enquiries and provide shortlisted options.</li>
                <li>Coordinate physical site visits and advisory walkthroughs.</li>
                <li>Share verified pricing and developer collateral on WhatsApp or email upon request.</li>
                <li>Maintain internal CRM relationship management.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#081120]">4. Zero Spam & Third-Party Selling Guarantee</h2>
              <p className="mt-2">
                We strictly <strong>never sell, rent, or trade</strong> your personal contact information to third-party
                marketing agencies, telemarketers, or unrelated entities. Your details are accessed solely by
                authorized Shivara relationship managers.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#081120]">5. Contact & Opt-Out</h2>
              <p className="mt-2">
                You may opt out of receiving property updates at any time by notifying our advisory desk via WhatsApp
                or calling {siteConfig.phone}.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
