"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

interface ReportChartsProps {
  sourceBreakdown: Record<string, number>;
  statusBreakdown: Record<string, number>;
}

const SOURCE_COLORS: Record<string, string> = {
  INSTAGRAM: "#EC4899",
  WHATSAPP: "#10B981",
  WEBSITE: "#3B82F6",
  FACEBOOK: "#6366F1",
  GOOGLE: "#EF4444",
  REFERRAL: "#14B8A6",
  OTHER: "#6B7280",
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "#3B82F6",
  CONTACTED: "#8B5CF6",
  FOLLOW_UP: "#F59E0B",
  SITE_VISIT_SCHEDULED: "#06B6D4",
  NEGOTIATION: "#F97316",
  CLOSED: "#10B981",
  LOST: "#EF4444",
};

export default function ReportCharts({ sourceBreakdown, statusBreakdown }: ReportChartsProps) {
  // Format source data
  const formattedSource = Object.entries(sourceBreakdown)
    .map(([source, count]) => ({
      name: source,
      value: count,
      color: SOURCE_COLORS[source] || "#6B7280",
    }))
    .filter((item) => item.value > 0);

  // Format status data
  const formattedStatus = Object.entries(statusBreakdown).map(([status, count]) => ({
    name: status.replace(/_/g, " "),
    count: count,
    color: STATUS_COLORS[status] || "#6B7280",
  }));

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg text-xs shadow-lg">
          <p className="font-semibold text-white">{payload[0].name}</p>
          <p className="text-[#C9A84C] font-bold mt-1">Leads: {payload[0].value || payload[0].payload.count}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Lead Pipeline Bar Chart */}
      <div className="flex flex-col h-[320px]">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Pipeline Distribution</h3>
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" vertical={false} />
              <XAxis dataKey="name" stroke="#8B949E" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#8B949E" fontSize={10} tickLine={false} axisLine={false} />
              <RechartsTooltip content={renderTooltip} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={30}>
                {formattedStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leads by Source Pie Chart */}
      <div className="flex flex-col h-[320px]">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Leads by Channel</h3>
        {formattedSource.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-slate-500 text-xs">
            No source data logged.
          </div>
        ) : (
          <div className="flex-grow relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedSource}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {formattedSource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={renderTooltip} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconSize={8}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "10px", color: "#9CA3AF" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
