import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock3, MapPin, Phone, Plus } from "lucide-react";
import { getServerSession } from "@/lib/auth";
import prisma, { isDatabaseConfigured } from "@/lib/prisma";
import { CRMEmptyState, CRMHero, CRMPanel, CRMMiniStat } from "@/components/crm/CRMPrimitives";

export const dynamic = "force-dynamic";

function range(daysAhead: number) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + daysAhead);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export default async function CRMCalendarPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/crm/login");

  const { start, end } = range(14);
  const agentFilter =
    session.user.role === "ADMIN" ? {} : { lead: { assignedToId: session.user.id } };

  const [siteVisits, followUps] = isDatabaseConfigured
    ? await Promise.all([
        prisma.siteVisit
          .findMany({
            where: {
              scheduledAt: { gte: start, lte: end },
              ...agentFilter,
            },
            include: {
              lead: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                  priority: true,
                  assignedTo: { select: { name: true } },
                },
              },
            },
            orderBy: { scheduledAt: "asc" },
          })
          .catch(() => []),
        prisma.lead
          .findMany({
            where: {
              followUpDate: { gte: start, lte: end },
              status: { notIn: ["CLOSED", "LOST"] },
              ...(session.user.role === "ADMIN" ? {} : { assignedToId: session.user.id }),
            },
            include: { assignedTo: { select: { name: true } } },
            orderBy: { followUpDate: "asc" },
          })
          .catch(() => []),
      ])
    : [[], []];

  const today = new Date().toDateString();
  const todaysVisits = siteVisits.filter((visit) => visit.scheduledAt.toDateString() === today);
  const todaysFollowUps = followUps.filter((lead) => lead.followUpDate?.toDateString() === today);

  return (
    <div className="space-y-6 text-white">
      <CRMHero
        eyebrow="Calendar command center"
        title="Meetings, site visits, and follow-ups in one field-ready view."
        description="Designed for agents on mobile and admins on desktop. Every upcoming activity is easy to scan, call, and act on."
        actions={
          <Link
            href="/crm/leads?addLead=1"
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[#F4B400] px-4 text-sm font-black text-[#081120]"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <CRMMiniStat label="Today's Visits" value={todaysVisits.length} tone="gold" />
        <CRMMiniStat label="Today's Follow-ups" value={todaysFollowUps.length} tone="blue" />
        <CRMMiniStat label="14-Day Visits" value={siteVisits.length} tone="green" />
        <CRMMiniStat label="14-Day Follow-ups" value={followUps.length} tone="purple" />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <CRMPanel title="Upcoming Site Visits" eyebrow="Physical meetings">
          {siteVisits.length === 0 ? (
            <CRMEmptyState
              icon={<CalendarDays className="h-7 w-7" />}
              title="No site visits scheduled"
              description="Scheduled site visits from lead details will appear here automatically."
            />
          ) : (
            <div className="space-y-3">
              {siteVisits.map((visit) => (
                <article key={visit.id} className="rounded-2xl border border-white/10 bg-[#0E1726]/75 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/crm/leads/${visit.lead.id}`} className="font-black text-white hover:text-[#F4B400]">
                        {visit.lead.name}
                      </Link>
                      <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                        <MapPin className="h-4 w-4 text-[#F4B400]" />
                        {visit.location}
                      </p>
                    </div>
                    <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-[10px] font-black text-cyan-300 ring-1 ring-cyan-400/20">
                      {visit.status}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                    <span className="flex items-center gap-2 text-slate-300">
                      <Clock3 className="h-4 w-4 text-[#F4B400]" />
                      {visit.scheduledAt.toLocaleString("en-IN")}
                    </span>
                    <a href={`tel:${visit.lead.phone}`} className="flex items-center gap-2 text-blue-300">
                      <Phone className="h-4 w-4" />
                      {visit.lead.phone}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CRMPanel>

        <CRMPanel title="Upcoming Follow-ups" eyebrow="Sales rhythm">
          {followUps.length === 0 ? (
            <CRMEmptyState
              icon={<Clock3 className="h-7 w-7" />}
              title="No follow-ups due"
              description="Follow-up dates set inside lead forms will appear in this calendar."
            />
          ) : (
            <div className="space-y-3">
              {followUps.map((lead) => (
                <article key={lead.id} className="rounded-2xl border border-white/10 bg-[#0E1726]/75 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/crm/leads/${lead.id}`} className="font-black text-white hover:text-[#F4B400]">
                        {lead.name}
                      </Link>
                      <p className="mt-1 text-sm text-slate-400">{lead.assignedTo?.name || "Unassigned"}</p>
                    </div>
                    <span className="rounded-full bg-[#F4B400]/10 px-2.5 py-1 text-[10px] font-black text-[#F4B400] ring-1 ring-[#F4B400]/20">
                      {lead.priority}
                    </span>
                  </div>
                  <p className="mt-4 flex items-center gap-2 text-sm text-slate-300">
                    <Clock3 className="h-4 w-4 text-[#F4B400]" />
                    {lead.followUpDate?.toLocaleString("en-IN")}
                  </p>
                </article>
              ))}
            </div>
          )}
        </CRMPanel>
      </div>
    </div>
  );
}
