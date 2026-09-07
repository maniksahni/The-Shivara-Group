import { HelpCircle } from "lucide-react";
import { advisoryDisclaimer } from "@/components/website/site-data";

export default function TrustSection() {
  return (
    <section className="bg-[#081120] py-16 text-white sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Responsible Legal Notice & Disclaimer Banner */}
        <div className="rounded-[1.6rem] border border-[#D4AF37]/25 bg-white/[0.035] p-5 sm:p-7">
          <div className="flex items-start gap-3.5">
            <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#F5D67B]" />
            <div className="text-xs leading-6 text-white/70">
              <p className="font-bold text-[#F5D67B] uppercase tracking-wider text-[11px] mb-1">
                Advisory Integrity & Legal Transparency
              </p>
              <p>{advisoryDisclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
