import React from "react";

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  status?: "default" | "success" | "danger" | "warning";
  className?: string;
}

export function KpiCard({
  label,
  value,
  unit,
  subtext,
  status = "default",
  className = "",
}: KpiCardProps) {
  const formattedValue = typeof value === "number" ? value.toLocaleString("pt-BR") : value;

  const statusColors = {
    default: "text-white border-white/10",
    success: "text-[#22c55e] border-[#22c55e]/30 shadow-[#22c55e]/10",
    danger: "text-[#ef4444] border-[#ef4444]/30 shadow-[#ef4444]/10",
    warning: "text-[#f59e0b] border-[#f59e0b]/30 shadow-[#f59e0b]/10",
  };

  const accentBars = {
    default: "bg-white/30",
    success: "bg-[#22c55e]",
    danger: "bg-[#ef4444]",
    warning: "bg-[#f59e0b]",
  };

  return (
    <div
      className={`relative flex flex-col justify-between rounded-lg bg-[#0b1320]/85 backdrop-blur-md p-3 px-4 border border-white/10 shadow-lg transition-all hover:border-white/20 hover:bg-[#0e192c]/90 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium tracking-wide uppercase text-zinc-300">
          {label}
        </span>
      </div>

      <div className="my-1 flex items-baseline gap-1.5">
        <span
          className={`font-mono text-2xl lg:text-3xl font-extrabold tracking-tight ${
            status === "default" ? "text-white" : statusColors[status].split(" ")[0]
          }`}
        >
          {formattedValue}
        </span>
        {unit && <span className="text-xs font-semibold text-zinc-400">{unit}</span>}
      </div>

      {subtext && <span className="text-[10px] text-zinc-400">{subtext}</span>}

      {/* Subtle bottom indicator line like Power BI cards */}
      <div className={`mt-2 h-[2px] w-full rounded-full ${accentBars[status]}`} />
    </div>
  );
}
