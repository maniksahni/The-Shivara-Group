import { redirect } from "next/navigation";
import Link from "next/link";
import { Activity, History, UserRound } from "lucide-react";
import { getServerSession } from "@/lib/auth";
import prisma, { isDatabaseConfigured } from "@/lib/prisma";
import { CRMEmptyState, CRMHero, CRMPanel, CRMMiniStat } from "@/components/crm/CRMPrimitives";

export const dynamic = "force-dynamic";

export default async function CRMActivitiesPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/crm/login");

  const activities = isDatabaseConfigured
    ? await prisma.leadActivity
        .findMany({
          where:
            session.user.role === "ADMIN"
              ? undefined
              : { lead: { assignedToId: session.user.id } },
          orderBy: { createdAt: "desc" },
          take: 80,
          include: {
            lead: { select: { id: true, name: true, status: true } },
            user: { select: { name: true, role: true } },
          },
        })
        .catch(() => [])
    : [];

  const systemCount = activities.filter((item) => !item.user).length;
  const todayCount = activities.filter(
    (item) => item.createdAt.toDateString() === new Date().toDateString(),
  ).length;

  return (
    <div className="space-y-6 text-white">
      <CRMHero
        eyebrow="Activity intelligence"
        title="A premium audit trail for every important lead movement."
        description="See lead creation, notes, assignment, status changes, and site visit updates in one clean timeline."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <CRMMiniStat label="Total Activities" value={activities.length} tone="gold" />
        <CRMMiniStat label="Today" value={todayCount} tone="green" />
        <CRMMiniStat label="System Events" value={systemCount} tone="purple" />
      </div>

      <CRMPanel title="Recent Activity Timeline" eyebrow="Live CRM feed">
        {activities.length === 0 ? (
          <CRMEmptyState
            icon={<Activity className="h-7 w-7" />}
            title="No activity yet"
            description="CRM actions will appear here as leads are created, updated, assigned, and followed up."
          />
        ) : (
          <div className="space-y-3">
            {activities.map((item) => (
              <article key={item.id} className="relative rounded-2xl border border-white/10 bg-[#0E1726]/75 p-4">
                <div className="flex gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F4B400]/10 text-[#F4B400] ring-1 ring-[#F4B400]/20">
                    <History className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <Link href={`/crm/leads/${item.lead.id}`} className="truncate font-black text-white hover:text-[#F4B400]">
                        {item.lead.name}
                      </Link>
                      <span className="text-xs font-semibold text-slate-500">
                        {item.createdAt.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {item.action}
                      {item.newValue && (
                        <span className="ml-1 text-[#F4B400]">&quot;{item.newValue}&quot;</span>
                      )}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.05] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-300 ring-1 ring-white/10">
                        <UserRound className="h-3 w-3" />
                        {item.user?.name || "System"}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider status-${item.lead.status.toLowerCase()}`}>
                        {item.lead.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </CRMPanel>
    </div>
  );
}
