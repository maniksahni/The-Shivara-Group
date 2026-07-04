import { redirect } from "next/navigation";
import { Bell, Database, KeyRound, ShieldCheck, Smartphone, UserCog } from "lucide-react";
import { getServerSession } from "@/lib/auth";
import { CRMHero, CRMPanel } from "@/components/crm/CRMPrimitives";

export const dynamic = "force-dynamic";

export default async function CRMSettingsPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/crm/login");

  const cards = [
    {
      icon: ShieldCheck,
      title: "Google-only authentication",
      text: "Production CRM access is restricted through authorised Google accounts configured in Railway.",
      status: "Active",
    },
    {
      icon: Database,
      title: "Railway database",
      text: "Prisma uses the Railway MySQL DATABASE_URL. Public pages gracefully fall back when DB is unavailable.",
      status: "Configured",
    },
    {
      icon: Bell,
      title: "Notifications",
      text: "Follow-up and overdue counts are surfaced in the topbar and navigation badges.",
      status: "Live",
    },
    {
      icon: Smartphone,
      title: "Mobile field mode",
      text: "CRM uses bottom navigation, safe-area spacing, and full-screen drawers on phones.",
      status: "Enabled",
    },
    {
      icon: KeyRound,
      title: "Admin controls",
      text: "Admin-only routes remain protected server-side and through route middleware.",
      status: session.user.role === "ADMIN" ? "Available" : "Restricted",
    },
    {
      icon: UserCog,
      title: "Profile source",
      text: "User identity is synced from the authenticated session and local CRM user record.",
      status: "Synced",
    },
  ];

  return (
    <div className="space-y-6 text-white">
      <CRMHero
        eyebrow="Settings"
        title="Production controls and CRM operating status."
        description="A clean operational view for authentication, deployment, notifications, and mobile field-readiness."
      />

      <CRMPanel title="System Readiness" eyebrow="Control center">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="rounded-[22px] border border-white/10 bg-[#0E1726]/75 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4B400]/10 text-[#F4B400] ring-1 ring-[#F4B400]/20">
                  <card.icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-400/20">
                  {card.status}
                </span>
              </div>
              <h2 className="mt-5 text-lg font-black text-white">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{card.text}</p>
            </article>
          ))}
        </div>
      </CRMPanel>
    </div>
  );
}
