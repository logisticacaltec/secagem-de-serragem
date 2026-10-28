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
import type { SemanaData } from "@/data/serragem-data";

interface VolumeSemanaChartProps {
  data: SemanaData[];
  title?: string;
  hasValorMedio?: boolean;
  selectedSemana?: number | null;
  onSelectSemana?: (sem: number | null) => void;
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
  payload?: SemanaData;
}

interface TooltipPayloadItem {
  color?: string;
  name?: string;
  value?: number | string;
  dataKey?: string;
  payload?: SemanaData;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

export function VolumeSemanaChart({
  data,
  title = "VOLUME SEMANA - TON",
  hasValorMedio = false,
  selectedSemana,
  onSelectSemana,
  className = "",
}: VolumeSemanaChartProps) {
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
      {hasValorMedio && (
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#94a3b8]" />
          <span className="text-zinc-200">Valor médio produto</span>
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff7a29]" />
        <span className="text-zinc-200">% Atendido</span>
      </div>
    </div>
  );

  return (
    <ChartContainer title={title} legend={legend} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 36, right: 20, left: 0, bottom: 5 }}
          onClick={(state) => {
            if (state && state.activeLabel !== undefined && onSelectSemana) {
              const clickedSemana = Number(state.activeLabel);
              onSelectSemana(clickedSemana === selectedSemana ? null : clickedSemana);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
          <XAxis
            dataKey="semana"
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
            domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.15)]}
          />
          <Tooltip content={<CustomWeeklyTooltip hasValorMedio={hasValorMedio} />} />
          <Bar
            dataKey="volumeEntregue"
            name="Volume entregue"
            fill="#1b91ff"
            radius={[3, 3, 0, 0]}
            maxBarSize={38}
            label={<CustomWeeklyBarLabel />}
          />
          <Bar
            dataKey="volumePrevisto"
            name="Volume previsto"
            fill="#102e9e"
            radius={[3, 3, 0, 0]}
            maxBarSize={38}
            label={<CustomWeeklyBarLabel />}
          />
          {hasValorMedio && (
            <Bar
              dataKey="valorMedio"
              name="Valor médio produto"
              fill="#94a3b8"
              radius={[3, 3, 0, 0]}
              maxBarSize={38}
              label={<CustomValorMedioBarLabel />}
            />
          )}
          {/* A linha de porcentagem segue a altura do volume entregue (recebido) */}
          <Line
            type="monotone"
            dataKey="volumeEntregue"
            name="% Atendido"
            stroke="#ff7a29"
            strokeWidth={2.5}
            dot={<CustomWeeklyDot />}
            activeDot={{ r: 6, fill: "#ff7a29", stroke: "#ffffff" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function CustomWeeklyBarLabel(props: BarLabelProps) {
  const { x = 0, y = 0, width = 0, value } = props;
  if (!value) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      fill="#ffffff"
      textAnchor="middle"
      fontSize={10}
      fontWeight={700}
    >
      {Math.round(Number(value))}
    </text>
  );
}

function CustomValorMedioBarLabel(props: BarLabelProps) {
  const { x = 0, y = 0, width = 0, value } = props;
  if (!value) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      fill="#cbd5e1"
      textAnchor="middle"
      fontSize={8}
      fontWeight={600}
    >
      R$ {Math.round(Number(value))}
    </text>
  );
}

function CustomWeeklyDot(props: DotProps) {
  const { cx, cy, payload } = props;
  if (cx === undefined || cy === undefined || !payload) return null;
  const pct = payload.percentAtendido;
  // Verde se tiver 100% ou acima, e vermelho se tiver abaixo de 100%
  const isTarget = pct >= 100;
  return (
    <g>
      <circle cx={cx} cy={cy} r={4.5} fill="#ff7a29" stroke="#ffffff" strokeWidth={1.5} />
      <g transform={`translate(${cx - 17}, ${cy - 23})`}>
        <rect
          width={34}
          height={16}
          rx={4}
          fill={isTarget ? "#22c55e" : "#ef4444"}
          fillOpacity={0.95}
        />
        <text
          x={17}
          y={8.5}
          fill="#ffffff"
          fontSize={9.5}
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

function CustomWeeklyTooltip({
  active,
  payload,
  label,
  hasValorMedio,
}: CustomTooltipProps & { hasValorMedio?: boolean }) {
  if (!active || !payload || !payload.length) return null;
  const itemData = payload[0]?.payload;
  const pct = itemData?.percentAtendido ?? 0;
  const isTarget = pct >= 100;

  return (
    <div className="rounded-lg border border-white/20 bg-[#070d18]/95 p-3 text-xs shadow-2xl backdrop-blur-md">
      <div className="mb-1.5 border-b border-white/10 pb-1 font-bold text-white uppercase tracking-wider">
        Semana {label}
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

        {hasValorMedio && itemData?.valorMedio && (
          <div className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-[#94a3b8]" />
              Valor médio produto:
            </span>
            <span className="font-mono font-bold text-zinc-200">
              R$ {Number(itemData.valorMedio).toFixed(2).replace(".", ",")}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-1">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-[#ff7a29]" />% Atendido:
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
