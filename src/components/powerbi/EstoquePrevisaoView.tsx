import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ChartContainer } from "./ChartContainer";
import { KpiCard } from "./KpiCard";
import { ESTOQUE_PREVISAO_SEMANAS, type EstoqueSemanalData } from "@/data/serragem-data";

interface EstoquePrevisaoViewProps {
  data?: EstoqueSemanalData[];
  selectedSemana?: number | null;
  onSelectSemana?: (sem: number | null) => void;
}

interface EstoqueBarLabelProps {
  x?: number;
  y?: number;
  width?: number;
  value?: number | string;
  index?: number;
  selectedSemana?: number | null;
  data?: EstoqueSemanalData[];
}

interface FluxoDotProps {
  cx?: number;
  cy?: number;
  stroke?: string;
  value?: number | null;
  payload?: EstoqueSemanalData;
  color?: string;
  isBoldLabel?: boolean;
  drawHighlightRect?: boolean;
  selectedSemana?: number | null;
}

interface TooltipPayloadItem {
  color?: string;
  name?: string;
  value?: number | string | null;
  dataKey?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

export function EstoquePrevisaoView({
  data = ESTOQUE_PREVISAO_SEMANAS,
  selectedSemana,
  onSelectSemana,
}: EstoquePrevisaoViewProps) {
  const [hoveredSemana, setHoveredSemana] = useState<number | null>(null);

  const activeSemana = hoveredSemana ?? selectedSemana ?? 43;
  const activeData =
    data.find((s) => s.semana === activeSemana) ||
    data.find((s) => s.isCurrentWeek) ||
    data[data.length - 1];

  const currentWeekData = activeData;

  const topLegend = (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs">
      <div className="flex items-center gap-1.5 rounded bg-white/5 px-2 py-0.5 border border-white/10">
        <span className="h-2.5 w-2.5 rounded-sm bg-[#102e9e]" />
        <span className="text-zinc-300 font-medium">ESTOQUE</span>
        <span className="font-mono font-bold text-white">
          {activeData.estoque.toLocaleString("pt-BR")}
        </span>
      </div>
      <div className="flex items-center gap-1.5 rounded bg-white/5 px-2 py-0.5 border border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-[#38bdf8]" />
        <span className="text-zinc-300 font-medium">ESTOQUE B 01</span>
        <span className="font-mono font-bold text-[#38bdf8]">
          {activeData.estoqueB01.toLocaleString("pt-BR")}
        </span>
      </div>
      <div className="flex items-center gap-1.5 rounded bg-white/5 px-2 py-0.5 border border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-[#84cc16]" />
        <span className="text-zinc-300 font-medium">ESTOQUE B 02</span>
        <span className="font-mono font-bold text-[#a3e635]">
          {activeData.estoqueB02.toLocaleString("pt-BR")}
        </span>
      </div>
    </div>
  );

  const bottomLegend = (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs">
      <div className="flex items-center gap-1.5 rounded bg-white/5 px-2 py-0.5 border border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-[#f97316]" />
        <span className="text-zinc-300 font-medium">CONSUMO CALTEC</span>
        <span className="font-mono font-bold text-[#fb923c]">
          {activeData.consumoCaltec.toLocaleString("pt-BR")}
        </span>
      </div>
      <div className="flex items-center gap-1.5 rounded bg-white/5 px-2 py-0.5 border border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]" />
        <span className="text-zinc-300 font-medium">PREVISÃO RECEBIMENTO</span>
        <span className="font-mono font-bold text-[#60a5fa]">
          {activeData.previsaoRecebimento.toLocaleString("pt-BR")}
        </span>
      </div>
      <div className="flex items-center gap-1.5 rounded bg-white/5 px-2 py-0.5 border border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-[#eab308]" />
        <span className="text-zinc-300 font-medium">ENTRADA FABRICA</span>
        <span className="font-mono font-bold text-[#facc15]">
          {activeData.entradaFabrica !== null
            ? activeData.entradaFabrica.toLocaleString("pt-BR")
            : "-"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* KPI highlight ribbon for Week 43 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Estoque Atual (Semana 43)"
          value={currentWeekData.estoque}
          unit="ton"
          status="warning"
          subtext="Capacidade controlada"
        />
        <KpiCard
          label="Entrada Fábrica"
          value={currentWeekData.entradaFabrica || 961}
          unit="ton"
          status="danger"
          subtext="Abaixo da previsão"
        />
        <KpiCard
          label="Consumo Caltec"
          value={currentWeekData.consumoCaltec}
          unit="ton"
          status="default"
          subtext="Consumo estável"
        />
        <KpiCard
          label="Previsão Recebimento"
          value={currentWeekData.previsaoRecebimento}
          unit="ton"
          status="success"
          subtext="Meta de abastecimento"
        />
      </div>

      {/* Top Chart: ESTOQUE SERRAGEM SECA - EVOLUÇÃO SEMANAL */}
      <ChartContainer
        title="ESTOQUE SERRAGEM SECA - EVOLUÇÃO SEMANAL"
        legend={topLegend}
        className="h-[310px] sm:h-[340px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 25, right: 15, left: -10, bottom: 5 }}
            onMouseMove={(state) => {
              if (state && state.activeLabel !== undefined) {
                setHoveredSemana(Number(state.activeLabel));
              }
            }}
            onMouseLeave={() => setHoveredSemana(null)}
            onClick={(state) => {
              if (state && state.activeLabel !== undefined && onSelectSemana) {
                const clickedSemana = Number(state.activeLabel);
                onSelectSemana(clickedSemana === selectedSemana ? null : clickedSemana);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" vertical={false} />
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
              domain={[0, 7500]}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomEstoqueTooltip />} />

            <Bar
              dataKey="estoque"
              name="ESTOQUE"
              fill="#102e9e"
              radius={[3, 3, 0, 0]}
              maxBarSize={44}
              label={<CustomEstoqueBarLabel data={data} selectedSemana={selectedSemana} />}
            />

            <Area
              type="monotone"
              dataKey="estoqueB01"
              name="ESTOQUE B 01"
              stroke="#38bdf8"
              fill="#38bdf8"
              fillOpacity={0.15}
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#38bdf8" }}
            />

            <Area
              type="monotone"
              dataKey="estoqueB02"
              name="ESTOQUE B 02"
              stroke="#84cc16"
              fill="#84cc16"
              fillOpacity={0.15}
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#84cc16" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Bottom Chart: CONSUMO x PREVISÃO x ENTRADA */}
      <ChartContainer
        title="ESTOQUE SERRAGEM SECA - EVOLUÇÃO SEMANAL (CONSUMO x PREVISÃO x ENTRADA)"
        legend={bottomLegend}
        className="h-[310px] sm:h-[340px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 25, right: 15, left: -10, bottom: 5 }}
            onMouseMove={(state) => {
              if (state && state.activeLabel !== undefined) {
                setHoveredSemana(Number(state.activeLabel));
              }
            }}
            onMouseLeave={() => setHoveredSemana(null)}
            onClick={(state) => {
              if (state && state.activeLabel !== undefined && onSelectSemana) {
                const clickedSemana = Number(state.activeLabel);
                onSelectSemana(clickedSemana === selectedSemana ? null : clickedSemana);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" vertical={false} />
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
              domain={[600, 1400]}
            />
            <Tooltip content={<CustomFluxoTooltip />} />

            <Line
              type="monotone"
              dataKey="consumoCaltec"
              name="CONSUMO CALTEC"
              stroke="#f97316"
              strokeWidth={2.5}
              dot={
                <CustomFluxoDot
                  color="#f97316"
                  drawHighlightRect={true}
                  selectedSemana={selectedSemana}
                />
              }
            />

            <Line
              type="monotone"
              dataKey="previsaoRecebimento"
              name="PREVISÃO RECEBIMENTO"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={<CustomFluxoDot color="#3b82f6" selectedSemana={selectedSemana} />}
            />

            <Line
              type="monotone"
              dataKey="entradaFabrica"
              name="ENTRADA FABRICA"
              stroke="#eab308"
              strokeWidth={2.5}
              connectNulls={false}
              dot={<CustomFluxoDot color="#eab308" isBoldLabel={true} selectedSemana={selectedSemana} />}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}

function CustomEstoqueBarLabel(props: EstoqueBarLabelProps) {
  const { x = 0, y = 0, width = 0, value, index = 0, selectedSemana, data = ESTOQUE_PREVISAO_SEMANAS } = props;
  if (!value) return null;
  const item = data[index];
  const isCurrent = selectedSemana ? item?.semana === selectedSemana : item?.isCurrentWeek;

  return (
    <g>
      {isCurrent && (
        <rect
          x={x - 2}
          y={0}
          width={width + 4}
          height={260}
          fill="none"
          stroke="#ef4444"
          strokeWidth={2.5}
          rx={4}
          className="animate-pulse"
        />
      )}
      <text
        x={x + width / 2}
        y={y - 8}
        fill={isCurrent ? "#fca5a5" : "#ffffff"}
        textAnchor="middle"
        fontSize={10}
        fontWeight={800}
      >
        {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
      </text>
    </g>
  );
}

function CustomFluxoDot(props: FluxoDotProps) {
  const {
    cx,
    cy,
    stroke,
    value,
    payload,
    color,
    isBoldLabel,
    drawHighlightRect,
    selectedSemana,
  } = props;
  if (cx === undefined || cy === undefined) return null;
  const isCurrent = selectedSemana
    ? payload?.semana === selectedSemana
    : payload?.isCurrentWeek;

  return (
    <g>
      {drawHighlightRect && isCurrent && (
        <rect
          x={cx - 24}
          y={0}
          width={48}
          height={260}
          fill="none"
          stroke="#ef4444"
          strokeWidth={2.5}
          rx={4}
          className="animate-pulse"
        />
      )}
      {value !== null && value !== undefined && (
        <>
          <circle
            cx={cx}
            cy={cy}
            r={isCurrent ? 5 : 3.5}
            fill={color || stroke}
            stroke="#ffffff"
            strokeWidth={1.5}
          />
          <text
            x={cx}
            y={cy - 9}
            fill="#ffffff"
            fontSize={isBoldLabel ? 10 : 9}
            fontWeight={isCurrent || isBoldLabel ? 800 : 600}
            textAnchor="middle"
          >
            {value}
          </text>
        </>
      )}
    </g>
  );
}

function CustomEstoqueTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const isCurrent = Number(label) === 43;
  return (
    <div className="rounded-lg border border-white/20 bg-[#070d18]/95 p-3 text-xs shadow-2xl backdrop-blur-md">
      <div className="mb-1.5 flex items-center justify-between border-b border-white/10 pb-1 font-bold text-white uppercase tracking-wider">
        <span>Semana {label}</span>
        {isCurrent && (
          <span className="rounded bg-red-600/80 px-1.5 py-0.5 text-[9px] font-extrabold text-white">
            Semana Atual
          </span>
        )}
      </div>
      {payload.map((entry, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}:
          </span>
          <span className="font-mono font-bold text-white">
            {Number(entry.value).toLocaleString("pt-BR")} ton
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomFluxoTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const isCurrent = Number(label) === 43;
  return (
    <div className="rounded-lg border border-white/20 bg-[#070d18]/95 p-3 text-xs shadow-2xl backdrop-blur-md">
      <div className="mb-1.5 flex items-center justify-between border-b border-white/10 pb-1 font-bold text-white uppercase tracking-wider">
        <span>Semana {label}</span>
        {isCurrent && (
          <span className="rounded bg-red-600/80 px-1.5 py-0.5 text-[9px] font-extrabold text-white">
            Semana Atual
          </span>
        )}
      </div>
      {payload.map((entry, i: number) => {
        if (entry.value === null || entry.value === undefined) return null;
        return (
          <div key={i} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-mono font-bold text-white">
              {Number(entry.value).toLocaleString("pt-BR")} ton
            </span>
          </div>
        );
      })}
    </div>
  );
}
