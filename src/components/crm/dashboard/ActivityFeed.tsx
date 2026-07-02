"use client";

import React from "react";
import Link from "next/link";
import { getRelativeTime } from "@/lib/utils";
import { PlusCircle, Edit3, CheckCircle2, UserPlus, Info, Calendar } from "lucide-react";

interface Activity {
  id: string;
  action: string;
  oldValue: string | null;
  newValue: string | null;
  createdAt: Date | string;
  lead: {
    id: string;
    name: string;
  };
  user: {
    name: string;
  } | null;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes("created")) return { icon: PlusCircle, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
    if (act.includes("status")) return { icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (act.includes("assigned")) return { icon: UserPlus, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
    if (act.includes("site visit")) return { icon: Calendar, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" };
    if (act.includes("note")) return { icon: Edit3, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { icon: Info, color: "text-slate-400 bg-slate-500/10 border-slate-500/20" };
  };

  if (activities.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-slate-500 text-xs py-10">
        No recent activities recorded.
      </div>
    );
  }

  return (
    <div className="space-y-4 pr-1">
      {activities.map((act) => {
        const { icon: Icon, color } = getActivityIcon(act.action);
        const performedBy = act.user?.name || "System";
        const relativeTime = getRelativeTime(act.createdAt);

        return (
          <div key={act.id} className="flex gap-3 text-xs border-b border-slate-800/40 pb-3 last:border-0 last:pb-0">
            {/* Action Icon */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>

            {/* Description */}
            <div className="flex-grow min-w-0">
              <p className="text-slate-200 leading-normal">
                <span className="font-semibold text-white">{performedBy}</span>{" "}
                {act.action.toLowerCase()}{" "}
                {act.newValue && (
                  <span className="text-[#C9A84C] font-semibold">
                    &quot;{act.newValue.replace(/_/g, " ")}&quot;
                  </span>
                )}
                {act.oldValue && !act.newValue && (
                  <span className="text-slate-400">
                    (was: {act.oldValue})
                  </span>
                )}
              </p>
              <p className="mt-1 text-slate-400 flex items-center gap-1.5">
                <span>On lead:</span>
                <Link
                  href={`/crm/leads/${act.lead.id}`}
                  className="text-blue-400 hover:text-blue-300 font-medium hover:underline truncate inline-block max-w-[140px]"
                >
                  {act.lead.name}
                </Link>
                <span className="text-slate-600">•</span>
                <span className="text-[10px] text-slate-500">{relativeTime}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
