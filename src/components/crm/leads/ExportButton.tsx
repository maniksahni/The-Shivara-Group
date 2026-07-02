"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { exportLeads } from "@/features/leads/actions";
import { useToast } from "@/components/ui/toast";
import * as XLSX from "xlsx";

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
      const rawData = res.data;

      // Transform keys into user-friendly uppercase Excel headers
      const formattedData = rawData.map((row: any) => ({
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

      // Create sheet using xlsx library
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads Database");

      // Auto-fit column widths
      const maxColWidth = formattedData.reduce((acc: any, row: any) => {
        Object.keys(row).forEach((key, colIndex) => {
          const cellLen = String(row[key] || "").length;
          const headerLen = key.length;
          const maxLen = Math.max(cellLen, headerLen) + 3;
          acc[colIndex] = Math.max(acc[colIndex] || 10, maxLen);
        });
        return acc;
      }, []);

      worksheet["!cols"] = maxColWidth.map((w: number) => ({ w }));

      // Trigger download
      const filename = `shivara-leads-${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(workbook, filename);

      toast({
        title: "Export Successful",
        description: `Successfully exported ${rawData.length} leads to Excel worksheet.`,
        type: "success",
      });
    } catch (err: any) {
      toast({
        title: "Export Failed",
        description: err.message || "Failed to generate Excel download.",
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
      <span>{loading ? "Exporting..." : "Export Excel"}</span>
    </button>
  );
}
