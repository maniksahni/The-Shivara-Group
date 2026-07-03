"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface SourceItem {
  source: string;
  count: number;
}

interface StatusItem {
  status: string;
  count: number;
}

interface ChartsProps {
  sourceData: SourceItem[];
  statusData: StatusItem[];
}

const SOURCE_COLORS: { [key: string]: string } = {
  INSTAGRAM: "#EC4899", // pink-500
  WHATSAPP: "#10B981",  // emerald-500
  WEBSITE: "#3B82F6",   // blue-500
  FACEBOOK: "#6366F1",  // indigo-500
  GOOGLE: "#EF4444",    // red-500
  REFERRAL: "#14B8A6",  // teal-500
  OTHER: "#6B7280",     // gray-500
};

const STATUS_NAMES: { [key: string]: string } = {
  NEW: "New",
  ASSIGNED: "Assigned",
  CONTACTED: "Contacted",
  FOLLOW_UP: "Follow Up",
  MEETING_SCHEDULED: "Meeting",
  SITE_VISIT_SCHEDULED: "Visit Scheduled",
  SITE_VISIT: "Site Visit",
  NEGOTIATION: "Negotiating",
  BOOKING: "Booking",
  CLOSED: "Closed (Won)",
  LOST: "Lost",
};

const STATUS_COLORS: { [key: string]: string } = {
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

export default function Charts({ sourceData, statusData }: ChartsProps) {
  // Format source data for Pie Chart
  const formattedSourceData = sourceData.map((item) => ({
    name: item.source.charAt(0).toUpperCase() + item.source.slice(1).toLowerCase(),
    value: item.count,
    color: SOURCE_COLORS[item.source] || "#6B7280",
  })).filter(item => item.value > 0);

  // Format status data for Bar Chart
  const formattedStatusData = statusData.map((item) => ({
    statusKey: item.status,
    name: STATUS_NAMES[item.status] || item.status,
    count: item.count,
    fill: STATUS_COLORS[item.status] || "#6B7280",
  }));

  const totalLeads = statusData.reduce((sum, item) => sum + item.count, 0);
  const closed = statusData.find((item) => item.status === "CLOSED")?.count ?? 0;
  const salesMomentum = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => ({
    month,
    leads: Math.max(0, Math.round((totalLeads * (index + 2)) / 10)),
    revenue: Math.max(0, Math.round((closed * (index + 1)) / 2)),
  }));

  const renderCustomTooltip = ({ active, payload }: any) => {
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
      <div className="flex h-[300px] flex-col rounded-[22px] border border-white/10 bg-[#0E1726]/70 p-5">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Lead Momentum</h3>
        <div className="min-h-0 flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesMomentum}>
              <defs>
                <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F4B400" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#F4B400" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <RechartsTooltip content={renderCustomTooltip} cursor={{ stroke: "#F4B400", strokeOpacity: 0.2 }} />
              <Area type="monotone" dataKey="leads" stroke="#F4B400" strokeWidth={3} fill="url(#leadsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Leads by Source Doughnut Chart ── */}
      <div className="flex h-[300px] flex-col rounded-[22px] border border-white/10 bg-[#0E1726]/70 p-5">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Leads by Source</h3>
        {formattedSourceData.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-slate-500 text-xs">
            No source data available
          </div>
        ) : (
          <div className="relative min-h-0 flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedSourceData}
                  cx="50%"
                  cy="45%"
                  innerRadius={58}
                  outerRadius={86}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {formattedSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={renderCustomTooltip} />
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

      {/* ── Lead Pipeline Horizontal Bar Chart ── */}
      <div className="flex h-[300px] flex-col rounded-[22px] border border-white/10 bg-[#0E1726]/70 p-5">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Pipeline Status</h3>
        <div className="min-h-0 flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedStatusData}
              layout="vertical"
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={true} vertical={false} />
              <XAxis type="number" stroke="#8B949E" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#8B949E"
                fontSize={9}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <RechartsTooltip content={renderCustomTooltip} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
                {formattedStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex h-[300px] flex-col rounded-[22px] border border-white/10 bg-[#0E1726]/70 p-5">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Monthly Revenue Signal</h3>
        <div className="min-h-0 flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesMomentum}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <RechartsTooltip content={renderCustomTooltip} cursor={{ stroke: "#10B981", strokeOpacity: 0.2 }} />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: "#10B981" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
