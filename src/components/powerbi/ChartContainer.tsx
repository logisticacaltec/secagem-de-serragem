import React from "react";

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  legend?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ChartContainer({
  title,
  subtitle,
  legend,
  children,
  className = "",
}: ChartContainerProps) {
  return (
    <div
      className={`relative flex flex-col rounded-xl bg-[#0b1320]/80 backdrop-blur-md border border-white/10 p-3 lg:p-4 shadow-xl overflow-hidden ${className}`}
    >
      <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-white/5 pb-2">
        <div>
          <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-white drop-shadow-sm">
            {title}
          </h3>
          {subtitle && <p className="text-[10px] text-zinc-400">{subtitle}</p>}
        </div>
        {legend && <div className="flex items-center gap-3 text-[11px]">{legend}</div>}
      </div>
      <div className="relative flex-1 min-h-[220px] w-full">{children}</div>
    </div>
  );
}
