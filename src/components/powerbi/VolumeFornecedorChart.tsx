import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartContainer } from "./ChartContainer";
import type { FornecedorData } from "@/data/serragem-data";

interface VolumeFornecedorChartProps {
  data: FornecedorData[];
  variant?: "vertical" | "horizontal";
  title?: string;
  className?: string;
}

interface BarLabelProps {
  x?: number;
  y?: number;
  width?: number;
  value?: number | string;
}

interface TooltipPayloadItem {
  value?: number | string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

export function VolumeFornecedorChart({
  data,
  variant = "vertical",
  title = "VOLUME ACUMULADO POR FORNECEDOR - YTD",
  className = "",
}: VolumeFornecedorChartProps) {
  if (variant === "horizontal") {
    const legend = (
      <div className="flex items-center gap-3 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#1b91ff]" />
          <span className="text-zinc-200">Volume entregue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#cbd5e1]" />
          <span className="text-zinc-200">VALOR</span>
        </div>
      </div>
    );

    return (
      <ChartContainer title={title} legend={legend} className={className}>
        <div className="flex h-full flex-col justify-around py-1 pr-4">
          {data.map((item, idx) => {
            const maxVal = Math.max(...data.map((d) => d.volumeEntregue));
            const barWidthPercent = (item.volumeEntregue / maxVal) * 82;
            return (
              <div key={idx} className="flex items-center gap-2 py-0.5 text-xs">
                {/* Supplier name */}
                <span className="w-28 shrink-0 truncate text-right font-semibold text-zinc-300 text-[10px] sm:text-[11px]">
                  {item.fornecedor}
                </span>

                {/* Bar track + value */}
                <div className="relative flex h-5 flex-1 items-center bg-white/5 rounded-sm overflow-hidden">
                  <div
                    className="flex h-full items-center justify-center bg-[#1b91ff] font-bold text-white text-[10px] transition-all duration-500 rounded-l-sm"
                    style={{ width: `${barWidthPercent}%` }}
                  >
                    <span className="px-1.5 drop-shadow-sm font-mono">
                      {item.volumeEntregue.toLocaleString("pt-BR")}
                    </span>
                  </div>

                  {/* Valor Médio badge */}
                  {item.valorMedio && (
                    <div className="ml-2 flex items-center rounded bg-slate-700/80 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm border border-white/10">
                      R$ {item.valorMedio}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ChartContainer>
    );
  }

  // Vertical Variant (for Secador)
  const legend = (
    <div className="flex items-center gap-2 text-xs">
      <span className="h-2.5 w-2.5 rounded-sm bg-[#1b91ff]" />
      <span className="text-zinc-200">Volume entregue</span>
    </div>
  );

  return (
    <ChartContainer title={title} legend={legend} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 25, right: 20, left: 0, bottom: 15 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
          <XAxis
            dataKey="fornecedor"
            stroke="#94a3b8"
            tick={{ fill: "#cbd5e1", fontSize: 11, fontWeight: 600 }}
            axisLine={{ stroke: "#ffffff20" }}
            tickLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomVerticalTooltip />} />
          <Bar
            dataKey="volumeEntregue"
            name="Volume entregue"
            fill="#1b91ff"
            radius={[4, 4, 0, 0]}
            maxBarSize={64}
            label={<CustomVerticalBarLabel />}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function CustomVerticalBarLabel(props: BarLabelProps) {
  const { x = 0, y = 0, width = 0, value } = props;
  if (!value) return null;
  return (
    <g>
      <rect x={x + width / 2 - 24} y={y - 20} width={48} height={17} rx={3} fill="#000000a0" />
      <text
        x={x + width / 2}
        y={y - 8}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontWeight={800}
      >
        {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
      </text>
    </g>
  );
}

function CustomVerticalTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length || payload[0]?.value === undefined) return null;
  return (
    <div className="rounded-lg border border-white/20 bg-[#070d18]/95 p-3 text-xs shadow-2xl backdrop-blur-md">
      <div className="mb-1 font-bold text-white uppercase tracking-wider">{label}</div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-zinc-300">Volume entregue:</span>
        <span className="font-mono font-bold text-[#1b91ff]">
          {Number(payload[0].value).toLocaleString("pt-BR")} ton
        </span>
      </div>
    </div>
  );
}
