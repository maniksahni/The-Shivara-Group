import type { Metadata } from "next";
import { FileText, Shield } from "lucide-react";
import { siteConfig } from "@/components/website/site-data";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions governing the use of The Shivara Group property advisory platform.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F8F5EE] py-28 px-4 sm:px-8 lg:px-12 text-[#081120]">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[2.4rem] border border-[#081120]/10 bg-white p-7 sm:p-12 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#FFF9E8] px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#9B7A19]">
            <FileText className="h-4 w-4" />
            Terms of Use
          </div>

          <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl font-semibold sm:text-5xl text-[#081120]">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs font-semibold text-[#6B7280]">
            Effective Date: September 2026 &bull; The Shivara Group
          </p>

          <div className="mt-8 space-y-6 text-sm leading-7 text-[#4B5563]">
            <section>
              <h2 className="text-lg font-bold text-[#081120]">1. Acceptance of Terms</h2>
              <p className="mt-2">
                By accessing or utilizing the website and advisory services provided by The Shivara Group
                (https://shivara.site), you acknowledge and agree to be bound by these Terms of Service. If you do
                not agree with any portion of these terms, please discontinue your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#081120]">2. Nature of Advisory Services</h2>
              <p className="mt-2">
                The Shivara Group functions solely as an independent real estate advisory, marketing consultancy,
                and buyer guidance agency. We facilitate property discovery, shortlisting, site visits, and
                commercial negotiations between prospective buyers and independent developers or property owners.
              </p>
              <p className="mt-2">
                We do not construct buildings, hold title ownership, or act as an escrow agent for real estate
                transactions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#081120]">3. Accuracy of Property Information</h2>
              <p className="mt-2">
                While we exercise due diligence to ensure property listings and prices are authentic and up to date,
                all property details, carpet areas, specifications, and availability statuses are subject to change
                without prior notice. Real estate transactions must be executed based on verified legal title
                documents and executed purchase agreements.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#081120]">4. Intellectual Property</h2>
              <p className="mt-2">
                All branding, logomarks, proprietary editorial content, UI designs, and custom layouts on this site
                are the intellectual property of The Shivara Group and protected under applicable copyright laws.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#081120]">5. Governing Law & Jurisdiction</h2>
              <p className="mt-2">
                These terms shall be governed by and construed in accordance with the laws of India. Any disputes
                arising under these terms shall be subject to the exclusive jurisdiction of the competent courts in
                Bareilly, Uttar Pradesh.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
