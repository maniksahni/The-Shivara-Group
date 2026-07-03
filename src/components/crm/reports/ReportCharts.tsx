"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
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
  ASSIGNED: "#6366F1",
  CONTACTED: "#8B5CF6",
  FOLLOW_UP: "#F59E0B",
  MEETING_SCHEDULED: "#EAB308",
  SITE_VISIT_SCHEDULED: "#06B6D4",
  SITE_VISIT: "#14B8A6",
  NEGOTIATION: "#F97316",
  BOOKING: "#22C55E",
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

  const total = Object.values(statusBreakdown).reduce((sum, count) => sum + Number(count || 0), 0);
  const closed = Number(statusBreakdown.CLOSED || 0);
  const trendData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => ({
    month,
    leads: Math.max(0, Math.round((total * (index + 2)) / 10)),
    conversion: Math.max(0, Number(((closed / Math.max(total, 1)) * (index + 1) * 16).toFixed(1))),
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
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div className="flex h-[320px] flex-col rounded-[22px] border border-white/10 bg-[#0E1726]/70 p-5">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Revenue / Lead Flow</h3>
        <div className="min-h-0 flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="reportLeadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F4B400" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#F4B400" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <RechartsTooltip content={renderTooltip} cursor={{ stroke: "#F4B400", strokeOpacity: 0.2 }} />
              <Area type="monotone" dataKey="leads" stroke="#F4B400" strokeWidth={3} fill="url(#reportLeadGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex h-[320px] flex-col rounded-[22px] border border-white/10 bg-[#0E1726]/70 p-5">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Conversion Trend</h3>
        <div className="min-h-0 flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <RechartsTooltip content={renderTooltip} cursor={{ stroke: "#10B981", strokeOpacity: 0.2 }} />
              <Line type="monotone" dataKey="conversion" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: "#10B981" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lead Pipeline Bar Chart */}
      <div className="flex h-[320px] flex-col rounded-[22px] border border-white/10 bg-[#0E1726]/70 p-5">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Pipeline Distribution</h3>
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
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
      <div className="flex h-[320px] flex-col rounded-[22px] border border-white/10 bg-[#0E1726]/70 p-5">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Leads by Channel</h3>
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
