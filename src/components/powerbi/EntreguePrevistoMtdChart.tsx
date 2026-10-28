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
  isEntregue?: boolean;
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
  payload?: MesData;
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
        <ComposedChart data={data} margin={{ top: 36, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
          <XAxis
            dataKey="mes"
            stroke="#94a3b8"
            tick={{ fill: "#cbd5e1", fontSize: 11, fontWeight: 500 }}
            axisLine={{ stroke: "#ffffff20" }}
            tickLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.15)]}
            tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="volumeEntregue"
            name="Volume entregue"
            fill="#1b91ff"
            radius={[3, 3, 0, 0]}
            maxBarSize={48}
            label={<CustomBarLabel isEntregue={true} />}
          />
          <Bar
            dataKey="volumePrevisto"
            name="Volume previsto"
            fill="#102e9e"
            radius={[3, 3, 0, 0]}
            maxBarSize={48}
            label={<CustomBarLabel isEntregue={false} />}
          />
          {/* A linha de porcentagem segue a altura do volume entregue (recebido) */}
          <Line
            type="monotone"
            dataKey="volumeEntregue"
            name="% Variação X Previsto"
            stroke="#ff7a29"
            strokeWidth={2.5}
            dot={<CustomDot />}
            activeDot={{ r: 6, fill: "#ff7a29", stroke: "#ffffff" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function CustomBarLabel(props: BarLabelProps) {
  const { x = 0, y = 0, width = 0, value, isEntregue } = props;
  if (!value) return null;
  return (
    <g>
      <rect
        x={x + width / 2 - 20}
        y={isEntregue ? y - 18 : y - 18}
        width={40}
        height={15}
        rx={3}
        fill="#000000a0"
      />
      <text
        x={x + width / 2}
        y={isEntregue ? y - 7 : y - 7}
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
  // Verde se tiver 100% ou acima, e vermelho se tiver abaixo de 100%
  const isTarget = pct >= 100;
  // Regra: abaixo do ponto se < 100%, acima do ponto se >= 100%
  const badgeY = isTarget ? cy - 24 : cy + 8;

  return (
    <g>
      <circle cx={cx} cy={cy} r={4.5} fill="#ff7a29" stroke="#ffffff" strokeWidth={1.5} />
      <g transform={`translate(${cx - 18}, ${badgeY})`}>
        <rect
          width={36}
          height={16}
          rx={4}
          fill={isTarget ? "#22c55e" : "#ef4444"}
          fillOpacity={0.95}
        />
        <text
          x={18}
          y={8.5}
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
  const itemData = payload[0]?.payload;
  const pct = itemData?.variacaoPercent ?? 0;
  const isTarget = pct >= 100;

  return (
    <div className="rounded-lg border border-white/20 bg-[#070d18]/95 p-3 text-xs shadow-2xl backdrop-blur-md">
      <div className="mb-1.5 border-b border-white/10 pb-1 font-bold text-white uppercase tracking-wider">
        {label}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-[#1b91ff]" />
            Volume entregue:
          </span>
          <span className="font-mono font-bold text-white">
            {Number(itemData?.volumeEntregue || 0).toLocaleString("pt-BR")} ton
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-[#102e9e]" />
            Volume previsto:
          </span>
          <span className="font-mono font-bold text-white">
            {Number(itemData?.volumePrevisto || 0).toLocaleString("pt-BR")} ton
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-1">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-[#ff7a29]" />% Variação X Previsto:
          </span>
          <span
            className={`font-mono font-extrabold px-1.5 py-0.5 rounded text-[11px] ${
              isTarget
                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                : "bg-red-950 text-red-400 border border-red-500/30"
            }`}
          >
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
}
