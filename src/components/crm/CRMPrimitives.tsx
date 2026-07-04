import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function CRMHero({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#162032]/80 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,180,0,0.18),transparent_34%),radial-gradient(circle_at_82%_14%,rgba(59,130,246,0.14),transparent_30%)]" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#F4B400]">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm leading-6 text-gray-400">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </section>
  );
}

export function CRMPanel({
  title,
  eyebrow,
  children,
  className,
  action,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-[26px] border border-white/10 bg-[#162032]/80 p-4 shadow-2xl shadow-black/15 backdrop-blur-xl sm:p-6",
        className,
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#F4B400]">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1 text-lg font-black text-white">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function CRMMiniStat({
  label,
  value,
  tone = "gold",
}: {
  label: string;
  value: string | number;
  tone?: "gold" | "blue" | "green" | "red" | "purple";
}) {
  const tones = {
    gold: "text-[#F4B400] bg-[#F4B400]/10 ring-[#F4B400]/20",
    blue: "text-blue-300 bg-blue-500/10 ring-blue-400/20",
    green: "text-emerald-300 bg-emerald-500/10 ring-emerald-400/20",
    red: "text-red-300 bg-red-500/10 ring-red-400/20",
    purple: "text-purple-300 bg-purple-500/10 ring-purple-400/20",
  };

  return (
    <div className={cn("rounded-2xl p-4 ring-1", tones[tone])}>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-70">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

export function CRMEmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06] text-[#F4B400]">
        {icon}
      </div>
      <h3 className="text-lg font-black text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}
