import React from "react";
import { Calendar, Filter, Maximize2, Minimize2, RotateCcw, Layers, Sparkles } from "lucide-react";

export type DashboardTab = "secador" | "seca" | "previsao";

interface DashboardHeaderProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  selectedSemana: number | null;
  onSemanaChange: (semana: number | null) => void;
  availableSemanas: number[];
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function DashboardHeader({
  currentTab,
  onTabChange,
  selectedSemana,
  onSemanaChange,
  availableSemanas,
  isFullscreen,
  onToggleFullscreen,
}: DashboardHeaderProps) {
  const titles: Record<DashboardTab, string> = {
    secador: "Serragem Secador",
    seca: "Serragem Seca",
    previsao: "Estoque e previsão",
  };

  return (
    <header className="relative z-20 flex flex-col gap-3 rounded-xl bg-[#070e1b]/90 p-3 sm:p-4 backdrop-blur-md border border-white/10 shadow-2xl">
      {/* Top row: Brand + Main Title + Slicer / Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wider text-white">
              CALTEC
            </span>
            <div className="h-6 w-[1.5px] bg-white/20" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#38bdf8]">
                Logística 2026
              </span>
              <span className="text-[9px] text-zinc-400">Reunião Semanal</span>
            </div>
          </div>

          <div className="hidden lg:block pl-6">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white drop-shadow">
              {titles[currentTab]}
            </h1>
          </div>
        </div>

        {/* Center Title for mobile/tablet */}
        <div className="lg:hidden">
          <h1 className="text-lg font-bold tracking-tight text-white drop-shadow">
            {titles[currentTab]}
          </h1>
        </div>

        {/* Right side controls: Slicer + Reset + Fullscreen */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Week Slicer */}
          <div className="relative flex items-center rounded-lg bg-white/10 px-2.5 py-1.5 border border-white/15 text-xs text-white">
            <Calendar className="mr-1.5 h-3.5 w-3.5 text-[#38bdf8]" />
            <span className="mr-2 text-zinc-400 text-[11px] font-medium hidden sm:inline">
              Semana:
            </span>
            <select
              value={selectedSemana === null ? "all" : selectedSemana}
              onChange={(e) => {
                const val = e.target.value;
                onSemanaChange(val === "all" ? null : Number(val));
              }}
              className="bg-transparent font-bold text-white text-xs outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0b1320] text-white">
                Todas as Semanas
              </option>
              {availableSemanas.map((sem) => (
                <option key={sem} value={sem} className="bg-[#0b1320] text-white">
                  Semana {sem} {sem === 43 ? "(Atual)" : ""}
                </option>
              ))}
            </select>
          </div>

          {selectedSemana !== null && (
            <button
              onClick={() => onSemanaChange(null)}
              title="Limpar filtro de semana"
              className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1.5 text-[11px] font-medium text-zinc-300 hover:bg-white/20 hover:text-white transition"
            >
              <RotateCcw className="h-3 w-3" />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          )}

          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
            className="flex items-center justify-center rounded-lg bg-white/10 p-2 text-zinc-300 hover:bg-white/20 hover:text-white transition"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Bottom row: Tab switcher matching Power BI page navigation */}
      <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onTabChange("secador")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              currentTab === "secador"
                ? "bg-[#1b91ff] text-white shadow-lg shadow-[#1b91ff]/30 ring-1 ring-white/30"
                : "bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Serragem Secador</span>
          </button>

          <button
            onClick={() => onTabChange("seca")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              currentTab === "seca"
                ? "bg-[#1b91ff] text-white shadow-lg shadow-[#1b91ff]/30 ring-1 ring-white/30"
                : "bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Serragem Seca</span>
          </button>

          <button
            onClick={() => onTabChange("previsao")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              currentTab === "previsao"
                ? "bg-[#1b91ff] text-white shadow-lg shadow-[#1b91ff]/30 ring-1 ring-white/30"
                : "bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Estoque e Previsão</span>
          </button>
        </nav>

        {/* Live status badge */}
        <div className="hidden sm:flex items-center gap-2 text-[10px] text-zinc-400">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Dados atualizados • YTD 2026</span>
        </div>
      </div>
    </header>
  );
}
