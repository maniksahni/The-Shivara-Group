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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
      {/* ── Leads by Source Doughnut Chart ── */}
      <div className="flex flex-col h-[280px]">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Leads by Source</h3>
        {formattedSourceData.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-slate-500 text-xs">
            No source data available
          </div>
        ) : (
          <div className="flex-grow relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedSourceData}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={75}
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
      <div className="flex flex-col h-[280px]">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Lead Pipeline Status</h3>
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedStatusData}
              layout="vertical"
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" horizontal={true} vertical={false} />
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
    </div>
  );
}
