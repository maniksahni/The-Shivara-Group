"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { exportLeads } from "@/features/leads/actions";
import { useToast } from "@/components/ui/toast";

const CSV_HEADERS = [
  "Lead ID",
  "Lead Name",
  "Phone Number",
  "WhatsApp",
  "Email Address",
  "Budget Range",
  "Preferred Location",
  "Property Type",
  "Source Channel",
  "Pipeline Status",
  "Priority Tier",
  "Assigned Agent",
  "Follow-up Scheduled",
  "Created Timestamp",
] as const;

function escapeCsvCell(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

interface ExportButtonProps {
  filters: {
    status?: string;
    source?: string;
    priority?: string;
    assignedToId?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export default function ExportButton({ filters }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await exportLeads(filters);
      if (!res.success) {
        throw new Error(res.error || "Export failed");
      }

      const rawData = res.data ?? [];

      const formattedData = rawData.map((row) => ({
        "Lead ID": row.id,
        "Lead Name": row.name,
        "Phone Number": row.phone,
        "WhatsApp": row.whatsappNumber || "N/A",
        "Email Address": row.email || "N/A",
        "Budget Range": row.budget || "N/A",
        "Preferred Location": row.preferredLocation || "N/A",
        "Property Type": row.propertyType || "N/A",
        "Source Channel": row.source,
        "Pipeline Status": row.status.replace(/_/g, " "),
        "Priority Tier": row.priority,
        "Assigned Agent": row.assignedTo || "Unassigned",
        "Follow-up Scheduled": row.followUpDate
          ? new Date(row.followUpDate).toLocaleString("en-IN")
          : "None Set",
        "Created Timestamp": new Date(row.createdAt).toLocaleString("en-IN"),
      }));

      // CSV opens cleanly in Excel/Numbers and avoids shipping a vulnerable,
      // heavyweight spreadsheet parser to every CRM browser.
      const csv = [
        CSV_HEADERS.map(escapeCsvCell).join(","),
        ...formattedData.map((row) =>
          CSV_HEADERS.map((header) => escapeCsvCell(row[header])).join(","),
        ),
      ].join("\r\n");
      const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `shivara-leads-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Successfully exported ${rawData.length} leads to an Excel-compatible CSV file.`,
        type: "success",
      });
    } catch (err: unknown) {
      toast({
        title: "Export Failed",
        description:
          err instanceof Error ? err.message : "Failed to generate the leads download.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 border border-slate-700 bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 hover:text-white disabled:opacity-50 transition-colors"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C9A84C]" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
      <span>{loading ? "Exporting..." : "Export Leads"}</span>
    </button>
  );
}
