"use client";

import { useMemo, useState } from "react";
import { Calculator, CheckCircle2, Heart, IndianRupee, MapPinned, Share2, Star, TrendingUp } from "lucide-react";
import type { PublicProperty } from "@/components/website/site-data";

function parsePriceHint(price: string) {
  const lower = price.toLowerCase();
  const number = Number((price.match(/[\d.]+/) || ["0"])[0]);
  if (!number) return 7500000;
  if (lower.includes("cr")) return number * 10000000;
  if (lower.includes("lakh") || lower.includes("lac")) return number * 100000;
  return number > 100000 ? number : number * 100000;
}

export default function PropertyExperienceClient({
  property,
  gallery,
}: {
  property: PublicProperty;
  gallery: string[];
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [loanYears, setLoanYears] = useState(20);
  const [interestRate, setInterestRate] = useState(8.75);
  const [downPayment, setDownPayment] = useState(20);

  const priceHint = parsePriceHint(property.price);
  const loanAmount = priceHint * (1 - downPayment / 100);
  const monthlyRate = interestRate / 12 / 100;
  const months = loanYears * 12;
  const emi = useMemo(() => {
    if (!monthlyRate) return loanAmount / months;
    return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }, [loanAmount, monthlyRate, months]);

  const shareProperty = async () => {
    const shareData = {
      title: property.title,
      text: `Explore ${property.title} by The Shivara Group`,
      url: window.location.href,
    };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined);
    } else {
      await navigator.clipboard.writeText(window.location.href).catch(() => undefined);
    }
  };

  return (
    <section className="px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="space-y-4">
          <div
            className="relative min-h-[520px] overflow-hidden rounded-[2.5rem] bg-cover bg-center shadow-[0_28px_90px_rgba(8,17,32,0.14)]"
            style={{
              backgroundImage: `linear-gradient(180deg,rgba(8,17,32,0.02),rgba(8,17,32,0.36)),url(${gallery[activeImage]})`,
            }}
          >
            <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#081120]">
              Gallery
            </div>
            <div className="absolute right-5 top-5 flex gap-2">
              <button
                type="button"
                onClick={() => setSaved((value) => !value)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/92 text-[#081120] shadow-xl"
                aria-label="Save property"
              >
                <Heart className={`h-5 w-5 ${saved ? "fill-[#D4AF37] text-[#D4AF37]" : ""}`} />
              </button>
              <button
                type="button"
                onClick={shareProperty}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/92 text-[#081120] shadow-xl"
                aria-label="Share property"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {gallery.slice(0, 3).map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(index)}
                className={`h-28 rounded-3xl bg-cover bg-center ring-2 transition ${
                  activeImage === index ? "ring-[#D4AF37]" : "ring-transparent"
                }`}
                style={{ backgroundImage: `url(${image})` }}
                aria-label={`Open image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2.5rem] border border-[#081120]/8 bg-white p-6 shadow-[0_24px_70px_rgba(8,17,32,0.07)]">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9B7A19]">
              Property intelligence
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                ["Investment score", "8.7/10", TrendingUp],
                ["Visit readiness", "High", CheckCircle2],
                ["Buyer confidence", "Verified", Star],
                ["Loan signal", "Eligible", IndianRupee],
              ].map(([label, value, Icon]) => (
                <div key={label as string} className="rounded-3xl bg-[#F8F5EE] p-4">
                  <Icon className="h-5 w-5 text-[#9B7A19]" />
                  <p className="mt-4 text-[10px] font-black uppercase tracking-[0.16em] text-[#6B7280]">
                    {label as string}
                  </p>
                  <p className="mt-1 text-lg font-black text-[#081120]">{value as string}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-[#081120] p-6 text-white shadow-[0_24px_70px_rgba(8,17,32,0.12)]">
            <div className="flex items-center gap-3">
              <Calculator className="h-6 w-6 text-[#D4AF37]" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D4AF37]">
                  Loan EMI estimate
                </p>
                <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold">
                  ₹{Math.round(emi).toLocaleString("en-IN")} / month
                </h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              <Range label="Down payment" value={downPayment} min={10} max={60} suffix="%" onChange={setDownPayment} />
              <Range label="Interest rate" value={interestRate} min={7} max={12} step={0.25} suffix="%" onChange={setInterestRate} />
              <Range label="Tenure" value={loanYears} min={5} max={30} suffix=" yrs" onChange={setLoanYears} />
            </div>
            <p className="mt-4 text-xs leading-5 text-white/46">
              EMI is an estimate only. Final loan terms depend on bank eligibility and verified pricing.
            </p>
          </div>

          <div className="rounded-[2.5rem] border border-[#081120]/8 bg-white p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9B7A19]">
              Nearby & location
            </p>
            <div className="mt-4 grid gap-3">
              {["Schools & daily needs", "Healthcare access", "Main road connectivity"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-[#F8F5EE] p-4">
                  <MapPinned className="h-5 w-5 text-[#9B7A19]" />
                  <span className="font-bold text-[#081120]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex justify-between text-xs font-black uppercase tracking-[0.16em] text-white/58">
        {label}
        <span className="text-[#F5D67B]">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[#D4AF37]"
      />
    </label>
  );
}
