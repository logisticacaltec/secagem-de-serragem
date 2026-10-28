import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import bgSecador from "@/assets/powerbi/Serragem_secador05980170169090138.png";
import bgPrevisao from "@/assets/powerbi/Estoque_e_previs_o8578798908874332.png";
import { DashboardHeader, type DashboardTab } from "./DashboardHeader";
import { KpiCard } from "./KpiCard";
import { EntreguePrevistoMtdChart } from "./EntreguePrevistoMtdChart";
import { VolumeFornecedorChart } from "./VolumeFornecedorChart";
import { VolumeSemanaChart } from "./VolumeSemanaChart";
import { EstoquePrevisaoView } from "./EstoquePrevisaoView";
import { parseExcelData, DEFAULT_DATASET, type DashboardDataset } from "@/lib/excel-parser";

const STORAGE_KEY = "caltec_serragem_dashboard_data_v1";

export function PowerBiDashboard() {
  const [currentTab, setCurrentTab] = useState<DashboardTab>("secador");
  const [selectedSemana, setSelectedSemana] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize with DEFAULT_DATASET to ensure clean SSR hydration
  const [dataset, setDataset] = useState<DashboardDataset>(DEFAULT_DATASET);

  // Load dataset from localStorage after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.secadorKpis && parsed.estoquePrevisaoSemanas) {
          setDataset(parsed as DashboardDataset);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar dados salvos:", err);
    }
  }, []);

  const isCustomData = dataset.sourceFileName !== DEFAULT_DATASET.sourceFileName;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Handle Excel file import
  const handleImportFile = async (file: File) => {
    try {
      setIsLoading(true);
      toast.info("Processando planilha...", { description: file.name });

      const buffer = await file.arrayBuffer();
      const newDataset = parseExcelData(buffer, file.name);

      setDataset(newDataset);
      setSelectedSemana(null);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newDataset));
      } catch (e) {
        console.warn("Não foi possível salvar no localStorage:", e);
      }

      toast.success("Planilha importada com sucesso!", {
        description: `${newDataset.secadorFornecedores.length} fornecedores e ${newDataset.estoquePrevisaoSemanas.length} semanas atualizadas.`,
      });
    } catch (err: unknown) {
      console.error("Erro ao importar planilha:", err);
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      toast.error("Erro ao importar planilha", {
        description: `Verifique se o arquivo é um Excel válido (.xlsx): ${msg}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetData = () => {
    setDataset(DEFAULT_DATASET);
    setSelectedSemana(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Erro ao remover do localStorage:", e);
    }
    toast.info("Dados restaurados para os valores padrão.");
  };

  // Drag and drop support
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      handleImportFile(file);
    } else {
      toast.error("Formato inválido. Arraste um arquivo .xlsx");
    }
  };

  // Filter weekly data if week is selected
  const secadorSemanasData = selectedSemana
    ? dataset.secadorSemanas.filter((s) => s.semana === selectedSemana)
    : dataset.secadorSemanas;

  const secaSemanasData = selectedSemana
    ? dataset.secaSemanas.filter((s) => s.semana === selectedSemana)
    : dataset.secaSemanas;

  const currentBg = currentTab === "previsao" ? bgPrevisao : bgSecador;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative min-h-screen w-full bg-[#030712] text-white overflow-x-hidden selection:bg-[#1b91ff]/30"
    >
      <Toaster position="top-right" richColors theme="dark" />

      {/* Drag & drop overlay indicator */}
      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md border-4 border-dashed border-emerald-400">
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-[#0b1320] p-8 text-center shadow-2xl border border-white/20">
            <span className="text-4xl">📊</span>
            <h3 className="text-xl font-bold text-white">Solte a planilha aqui para atualizar</h3>
            <p className="text-sm text-zinc-400">
              Acompanhamento de Recebimento de Cal e Serragem Secador (.xlsx)
            </p>
          </div>
        </div>
      )}

      {/* Background with real Power BI Caltec backdrop */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 opacity-30"
        style={{ backgroundImage: `url(${currentBg})` }}
      />
      {/* Dark gradient overlay for visual clarity */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#030712]/95 via-[#070e1c]/90 to-[#030712]/98" />

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col p-2.5 sm:p-4 lg:p-6 gap-4">
        {/* Navigation & Toolbar Header */}
        <DashboardHeader
          currentTab={currentTab}
          onTabChange={(tab) => {
            setCurrentTab(tab);
            setSelectedSemana(null);
          }}
          selectedSemana={selectedSemana}
          onSemanaChange={setSelectedSemana}
          availableSemanas={dataset.availableSemanas}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onImportFile={handleImportFile}
          onResetData={handleResetData}
          isCustomData={isCustomData}
          sourceFileName={dataset.sourceFileName}
          lastUpdated={dataset.lastUpdated}
          isLoading={isLoading}
        />

        {/* 1. SERRAGEM SECADOR TAB */}
        {currentTab === "secador" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {/* Top Grid: Charts */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Entregue x Previsto - MTD */}
              <div className="lg:col-span-7">
                <EntreguePrevistoMtdChart
                  data={dataset.secadorMtd}
                  className="h-[320px] sm:h-[350px]"
                />
              </div>

              {/* Volume Acumulado Por Fornecedor - YTD */}
              <div className="lg:col-span-5">
                <VolumeFornecedorChart
                  data={dataset.secadorFornecedores}
                  variant="vertical"
                  className="h-[320px] sm:h-[350px]"
                />
              </div>
            </div>

            {/* Bottom Row: KPIs + Volume Semana */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Left KPI Cards */}
              <div className="flex flex-col justify-between gap-3 lg:col-span-3">
                <KpiCard
                  label="Volume entregue YTD"
                  value={dataset.secadorKpis.volumeEntregueYTD}
                  unit="ton"
                  status="default"
                  subtext="Total consolidado 2026"
                />
                <KpiCard
                  label="Volume previsto YTD"
                  value={dataset.secadorKpis.volumePrevistoYTD}
                  unit="ton"
                  status="default"
                  subtext="Meta acumulada"
                />
                <KpiCard
                  label="% Atendido"
                  value={`${dataset.secadorKpis.percentAtendido}%`}
                  status={dataset.secadorKpis.percentAtendido >= 90 ? "success" : "danger"}
                  subtext={
                    dataset.secadorKpis.percentAtendido >= 90
                      ? "Dentro da meta planejada"
                      : "Meta recomendada: ≥ 90%"
                  }
                />
              </div>

              {/* Volume Semana - TON */}
              <div className="lg:col-span-9">
                <VolumeSemanaChart
                  data={secadorSemanasData}
                  selectedSemana={selectedSemana}
                  onSelectSemana={setSelectedSemana}
                  className="h-[340px] sm:h-[380px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. SERRAGEM SECA TAB */}
        {currentTab === "seca" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {/* Top Grid: Charts */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Entregue x Previsto - MTD */}
              <div className="lg:col-span-6">
                <EntreguePrevistoMtdChart
                  data={dataset.secaMtd}
                  className="h-[340px] sm:h-[370px]"
                />
              </div>

              {/* Volume Acumulado Por Fornecedor - YTD (horizontal) */}
              <div className="lg:col-span-6">
                <VolumeFornecedorChart
                  data={dataset.secaFornecedores}
                  variant="horizontal"
                  className="h-[340px] sm:h-[370px]"
                />
              </div>
            </div>

            {/* Bottom Row: KPIs + Volume Semana */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Left KPI Cards */}
              <div className="flex flex-col justify-between gap-3 lg:col-span-3">
                <KpiCard
                  label="Volume entregue YTD"
                  value={dataset.secaKpis.volumeEntregueYTD}
                  unit="ton"
                  status="default"
                  subtext="Total consolidado 2026"
                />
                <KpiCard
                  label="Volume previsto YTD"
                  value={dataset.secaKpis.volumePrevistoYTD}
                  unit="ton"
                  status="default"
                  subtext="Meta acumulada"
                />
                <KpiCard
                  label="% Atendido"
                  value={`${dataset.secaKpis.percentAtendido}%`}
                  status={dataset.secaKpis.percentAtendido >= 100 ? "success" : "warning"}
                  subtext={
                    dataset.secaKpis.percentAtendido >= 100
                      ? "Meta superada com sucesso"
                      : "Meta recomendada: ≥ 90%"
                  }
                />
              </div>

              {/* Volume Semana - TON with valor médio */}
              <div className="lg:col-span-9">
                <VolumeSemanaChart
                  data={secaSemanasData}
                  hasValorMedio={true}
                  selectedSemana={selectedSemana}
                  onSelectSemana={setSelectedSemana}
                  className="h-[340px] sm:h-[380px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. ESTOQUE E PREVISÃO TAB */}
        {currentTab === "previsao" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <EstoquePrevisaoView
              selectedSemana={selectedSemana}
              onSelectSemana={setSelectedSemana}
            />
          </div>
        )}

        {/* Footer info bar */}
        <footer className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/10 pt-3 text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">CALTEC Logística</span>
            <span>•</span>
            <span>Dashboard Gerencial Integrado</span>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <span>Fonte: {dataset.sourceFileName}</span>
            <span>•</span>
            <span className="text-[#38bdf8]">Semana Atual: 43</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
