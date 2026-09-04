import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, FileCheck2, HelpCircle, ShieldAlert } from "lucide-react";
import { siteConfig } from "@/components/website/site-data";

export const metadata: Metadata = {
  title: "Legal Disclaimer & Advisory Notice",
  description:
    "Important advisory disclosures, property information transparency, and legal verification notices for The Shivara Group real estate platform.",
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#F8F5EE] py-28 px-4 sm:px-8 lg:px-12 text-[#081120]">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[2.4rem] border border-[#081120]/10 bg-white p-7 sm:p-12 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#FFF9E8] px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#9B7A19]">
            <ShieldAlert className="h-4 w-4" />
            Advisory Notice
          </div>

          <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl font-semibold sm:text-5xl text-[#081120]">
            Legal Disclaimer & Information Transparency
          </h1>
          <p className="mt-2 text-xs font-semibold text-[#6B7280]">
            Last Updated: September 2026 &bull; The Shivara Group
          </p>

          <div className="mt-8 space-y-6 text-sm leading-7 text-[#4B5563]">
            <section className="rounded-2xl border border-[#D4AF37]/30 bg-[#FFF9E8] p-5 text-[#081120]">
              <h2 className="text-base font-bold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-[#9B7A19]" />
                Essential Advisory Notice to Buyers & Investors
              </h2>
              <p className="mt-2 text-xs leading-6 text-[#4B5563]">
                The Shivara Group operates strictly as an independent real estate advisory, marketing
                consultancy, and buyer-representation agency. The Shivara Group is not a developer, builder,
                or legal title guaranteeing agency.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#081120]">
                1. Separation of Verified vs. Public Project Information
              </h2>
              <p className="mt-2">
                <strong>Shivara Verified Information:</strong> Information flagged as &quot;Shivara Verified&quot;
                indicates that our team has physically visited the site, reviewed project presentation
                materials, confirmed current availability with the developer or authorized owner, and verified
                price indications as of the inspection date.
              </p>
              <p className="mt-2">
                <strong>Public & Developer Information:</strong> Information regarding layout plans, floor
                areas, specifications, projected possession dates, and promotional collateral is sourced from
                developers, authorized sellers, or public marketing publications. We do not independently
                warrant that all developer claims are error-free or perpetually current.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#081120]">
                2. Pricing & Availability Fluctuation
              </h2>
              <p className="mt-2">
                Prices displayed on this platform are indicative starting points or guide prices based on
                recent listings. Real estate prices, developer payment plans, registry charges, and unit
                availabilities fluctuate based on market dynamics, floor rise charges, orientation premiums,
                and construction milestones. All prices must be formally confirmed with the seller prior to
                executing any financial transaction or agreement.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#081120]">
                3. Mandatory Independent Legal Verification
              </h2>
              <p className="mt-2">
                Prospective buyers and investors are strongly advised to independently verify all property
                documents, title deeds, encumbrance certificates, municipal development authority sanctions
                (e.g. BDA Bareilly, YEIDA, GNIDA), RERA registration certificates, and mutation papers through
                independent legal counsel prior to signing agreements or making advance deposits.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#081120]">
                4. Limitation of Liability
              </h2>
              <p className="mt-2">
                Under no circumstances shall The Shivara Group, its founders, advisors, or representatives be
                held liable for any direct, indirect, incidental, or consequential damages resulting from
                decisions made based on information presented on this website. Content is provided for general
                informational and discovery purposes only.
              </p>
            </section>

            <section className="border-t border-[#081120]/10 pt-6">
              <p className="text-xs text-[#6B7280]">
                For questions concerning our advisory practices, please contact our desk at{" "}
                <a href={siteConfig.phoneHref} className="font-bold text-[#081120] underline">
                  {siteConfig.phone}
                </a>{" "}
                or write to our relationship desk.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
