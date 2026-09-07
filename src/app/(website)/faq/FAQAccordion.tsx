"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQ = { question: string; answer: string };

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-10 space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={faq.question}
            className={`rounded-2xl border transition-all duration-200 ${
              isOpen
                ? "border-[#D4AF37]/40 bg-[#081120] text-white"
                : "border-[#081120]/10 bg-[#F8F5EE] text-[#081120]"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-base font-bold sm:text-lg">{faq.question}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-[#D4AF37]" : "text-[#9CA3AF]"
                }`}
              />
            </button>
            {isOpen && (
              <p className="px-5 pb-5 text-xs leading-6 text-white/80 sm:text-sm">
                {faq.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
