import React, { useRef } from "react";
import {
  Calendar,
  Maximize2,
  Minimize2,
  RotateCcw,
  Layers,
  Sparkles,
  FileSpreadsheet,
  Upload,
  CheckCircle2,
} from "lucide-react";

export type DashboardTab = "secador" | "seca" | "previsao";

interface DashboardHeaderProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  selectedSemana: number | null;
  onSemanaChange: (semana: number | null) => void;
  availableSemanas: number[];
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onImportFile: (file: File) => void;
  onResetData?: () => void;
  isCustomData?: boolean;
  sourceFileName?: string;
  lastUpdated?: string;
  isLoading?: boolean;
}

export function DashboardHeader({
  currentTab,
  onTabChange,
  selectedSemana,
  onSemanaChange,
  availableSemanas,
  isFullscreen,
  onToggleFullscreen,
  onImportFile,
  onResetData,
  isCustomData = false,
  sourceFileName,
  lastUpdated,
  isLoading = false,
}: DashboardHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const titles: Record<DashboardTab, string> = {
    secador: "Serragem Secador",
    seca: "Serragem Seca",
    previsao: "Estoque e previsão",
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportFile(file);
      // Reset input so same file can be re-selected if updated
      e.target.value = "";
    }
  };

  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <header className="relative z-20 flex flex-col gap-3 rounded-xl bg-[#070e1b]/90 p-3 sm:p-4 backdrop-blur-md border border-white/10 shadow-2xl">
      {/* Hidden file input for Excel upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        className="hidden"
        onChange={handleFileChange}
      />

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

        {/* Right side controls: Import Excel + Slicer + Fullscreen */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Button: Importar Planilha Excel */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            title="Importar planilha 'Acompanhamento de Recebimento de Cal e Serragem Secador 2026.xlsx'"
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold transition shadow-lg shadow-emerald-950/40 border border-emerald-400/30 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 text-emerald-200" />
            )}
            <span>Importar Excel</span>
          </button>

          {/* Reset button if custom data is active */}
          {isCustomData && onResetData && (
            <button
              onClick={onResetData}
              title="Restaurar dados originais"
              className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 hover:bg-white/20 hover:text-white transition"
            >
              <RotateCcw className="h-3 w-3" />
              <span className="hidden sm:inline">Restaurar</span>
            </button>
          )}

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
            className="flex items-center justify-center rounded-lg bg-white/10 p-2 text-zinc-300 hover:bg-white/20 hover:text-white transition cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Bottom row: Tab switcher matching Power BI page navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-white/10 pt-2.5">
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onTabChange("secador")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
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
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
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
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              currentTab === "previsao"
                ? "bg-[#1b91ff] text-white shadow-lg shadow-[#1b91ff]/30 ring-1 ring-white/30"
                : "bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Estoque e Previsão</span>
          </button>
        </nav>

        {/* Live status badge with source file and update time */}
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-zinc-300">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="truncate max-w-[280px]">{sourceFileName || "SERRAGEM 2026.pbix"}</span>
          {formattedTime && <span className="text-zinc-500">• {formattedTime}</span>}
        </div>
      </div>
    </header>
  );
}
