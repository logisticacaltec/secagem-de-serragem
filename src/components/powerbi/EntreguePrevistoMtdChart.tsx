import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ChartContainer } from "./ChartContainer";
import type { MesData } from "@/data/serragem-data";

interface EntreguePrevistoMtdChartProps {
  data: MesData[];
  title?: string;
  className?: string;
}

interface BarLabelProps {
  x?: number;
  y?: number;
  width?: number;
  value?: number | string;
}

interface DotProps {
  cx?: number;
  cy?: number;
  payload?: MesData;
}

interface TooltipPayloadItem {
  color?: string;
  name?: string;
  value?: number | string;
  dataKey?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

export function EntreguePrevistoMtdChart({
  data,
  title = "ENTREGUE x PREVISTO - MTD",
  className = "",
}: EntreguePrevistoMtdChartProps) {
  const legend = (
    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs">
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm bg-[#1b91ff]" />
        <span className="text-zinc-200">Volume entregue</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm bg-[#102e9e]" />
        <span className="text-zinc-200">Volume previsto</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff7a29]" />
        <span className="text-zinc-200">% Variação X Previsto</span>
      </div>
    </div>
  );

  return (
    <ChartContainer title={title} legend={legend} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 25, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
          <XAxis
            dataKey="mes"
            stroke="#94a3b8"
            tick={{ fill: "#cbd5e1", fontSize: 11, fontWeight: 500 }}
            axisLine={{ stroke: "#ffffff20" }}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#ff7a29"
            domain={[0, 120]}
            tick={{ fill: "#ff7a29", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            yAxisId="left"
            dataKey="volumeEntregue"
            name="Volume entregue"
            fill="#1b91ff"
            radius={[3, 3, 0, 0]}
            maxBarSize={48}
            label={<CustomBarLabel isEntregue={true} />}
          />
          <Bar
            yAxisId="left"
            dataKey="volumePrevisto"
            name="Volume previsto"
            fill="#102e9e"
            radius={[3, 3, 0, 0]}
            maxBarSize={48}
            label={<CustomBarLabel isEntregue={false} />}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="variacaoPercent"
            name="% Variação X Previsto"
            stroke="#ff7a29"
            strokeWidth={3}
            dot={<CustomDot />}
            activeDot={{ r: 6, fill: "#ff7a29", stroke: "#ffffff" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function CustomBarLabel(props: BarLabelProps & { isEntregue?: boolean }) {
  const { x = 0, y = 0, width = 0, value } = props;
  if (!value) return null;
  return (
    <g>
      <rect x={x + width / 2 - 20} y={y - 18} width={40} height={15} rx={3} fill="#000000a0" />
      <text
        x={x + width / 2}
        y={y - 7}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        fontWeight={700}
      >
        {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
      </text>
    </g>
  );
}

function CustomDot(props: DotProps) {
  const { cx, cy, payload } = props;
  if (cx === undefined || cy === undefined || !payload) return null;
  const pct = payload.variacaoPercent;
  const isHigh = pct >= 80;
  return (
    <g>
      <circle cx={cx} cy={cy} r={4} fill="#ff7a29" stroke="#ffffff" strokeWidth={1.5} />
      <g transform={`translate(${cx - 18}, ${cy - 24})`}>
        <rect
          width={36}
          height={16}
          rx={4}
          fill={isHigh ? "#22c55e" : "#ef4444"}
          fillOpacity={0.85}
        />
        <text
          x={18}
          y={9}
          fill="#ffffff"
          fontSize={10}
          fontWeight={800}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {pct}%
        </text>
      </g>
    </g>
  );
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-white/20 bg-[#070d18]/95 p-3 text-xs shadow-2xl backdrop-blur-md">
      <div className="mb-1.5 border-b border-white/10 pb-1 font-bold text-white uppercase tracking-wider">
        {label}
      </div>
      {payload.map((entry, i: number) => {
        const isPct = entry.dataKey === "variacaoPercent";
        return (
          <div key={i} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-mono font-bold text-white">
              {isPct ? `${entry.value}%` : `${Number(entry.value).toLocaleString("pt-BR")} ton`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
