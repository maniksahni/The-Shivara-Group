import React from "react";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getServerSession } from "@/lib/auth";
import { getLeadById } from "@/features/leads/actions";
import prisma from "@/lib/prisma";
import LeadHeader from "@/components/crm/leads/LeadHeader";
import LeadDetailPanel from "@/components/crm/leads/LeadDetailPanel";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 0; // Fetch fresh data

export default async function LeadDetailPage({ params }: PageProps) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/crm/login");
  }

  const { id } = await params;

  // Fetch full lead details
  const leadRes = await getLeadById(id);
  if (!leadRes.success || !leadRes.data) {
    notFound();
  }

  const lead = leadRes.data;

  // Fetch list of agents for assigning/reassigning leads
  let agents: any[] = [];
  try {
    agents = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    });
  } catch (err) {
    console.error("Failed to fetch agents for detail view", err);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-[family-name:var(--font-inter)]">
      {/* ── Top Bar / Back Navigation ── */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-4">
        <div className="mx-auto max-w-screen-2xl flex items-center justify-between">
          <Link
            href="/crm/leads"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-[#C9A84C] text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pipeline
          </Link>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">
            Lead Management Workspace
          </div>
        </div>
      </div>

      {/* ── Main Detail Content Grid ── */}
      <div className="mx-auto max-w-screen-2xl px-6 py-8 space-y-6">
        {/* Header Block: quick actions, status pills, assignment */}
        <LeadHeader
          lead={lead}
          agents={agents}
          currentUserId={session.user.id}
          isAdmin={session.user.role === "ADMIN"}
        />

        {/* Panel Blocks: left detailed parameters, right notes/activity feed */}
        <LeadDetailPanel
          lead={lead}
          currentUserId={session.user.id}
        />
      </div>
    </div>
  );
}
