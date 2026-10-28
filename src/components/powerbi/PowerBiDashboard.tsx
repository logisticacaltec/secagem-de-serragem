import React, { useState, useEffect } from "react";
import bgSecador from "@/assets/powerbi/Serragem_secador05980170169090138.png";
import bgPrevisao from "@/assets/powerbi/Estoque_e_previs_o8578798908874332.png";
import { DashboardHeader, type DashboardTab } from "./DashboardHeader";
import { KpiCard } from "./KpiCard";
import { EntreguePrevistoMtdChart } from "./EntreguePrevistoMtdChart";
import { VolumeFornecedorChart } from "./VolumeFornecedorChart";
import { VolumeSemanaChart } from "./VolumeSemanaChart";
import { EstoquePrevisaoView } from "./EstoquePrevisaoView";

import {
  SERRAGEM_SECADOR_KPIS,
  SERRAGEM_SECADOR_MTD,
  SERRAGEM_SECADOR_FORNECEDORES,
  SERRAGEM_SECADOR_SEMANAS,
  SERRAGEM_SECA_KPIS,
  SERRAGEM_SECA_MTD,
  SERRAGEM_SECA_FORNECEDORES,
  SERRAGEM_SECA_SEMANAS,
} from "@/data/serragem-data";

export function PowerBiDashboard() {
  const [currentTab, setCurrentTab] = useState<DashboardTab>("secador");
  const [selectedSemana, setSelectedSemana] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Available weeks
  const availableSemanas = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];

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

  // Filter weekly data if week is selected
  const secadorSemanasData = selectedSemana
    ? SERRAGEM_SECADOR_SEMANAS.filter((s) => s.semana === selectedSemana)
    : SERRAGEM_SECADOR_SEMANAS;

  const secaSemanasData = selectedSemana
    ? SERRAGEM_SECA_SEMANAS.filter((s) => s.semana === selectedSemana)
    : SERRAGEM_SECA_SEMANAS;

  const currentBg = currentTab === "previsao" ? bgPrevisao : bgSecador;

  return (
    <div className="relative min-h-screen w-full bg-[#030712] text-white overflow-x-hidden selection:bg-[#1b91ff]/30">
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
          availableSemanas={availableSemanas}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />

        {/* 1. SERRAGEM SECADOR TAB */}
        {currentTab === "secador" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {/* Top Grid: Charts */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Entregue x Previsto - MTD */}
              <div className="lg:col-span-7">
                <EntreguePrevistoMtdChart
                  data={SERRAGEM_SECADOR_MTD}
                  className="h-[320px] sm:h-[350px]"
                />
              </div>

              {/* Volume Acumulado Por Fornecedor - YTD */}
              <div className="lg:col-span-5">
                <VolumeFornecedorChart
                  data={SERRAGEM_SECADOR_FORNECEDORES}
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
                  value={SERRAGEM_SECADOR_KPIS.volumeEntregueYTD}
                  unit="ton"
                  status="default"
                  subtext="Total consolidado 2026"
                />
                <KpiCard
                  label="Volume previsto YTD"
                  value={SERRAGEM_SECADOR_KPIS.volumePrevistoYTD}
                  unit="ton"
                  status="default"
                  subtext="Meta acumulada"
                />
                <KpiCard
                  label="% Atendido"
                  value={`${SERRAGEM_SECADOR_KPIS.percentAtendido}%`}
                  status="danger"
                  subtext="Meta recomendada: ≥ 90%"
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
                  data={SERRAGEM_SECA_MTD}
                  className="h-[340px] sm:h-[370px]"
                />
              </div>

              {/* Volume Acumulado Por Fornecedor - YTD (horizontal) */}
              <div className="lg:col-span-6">
                <VolumeFornecedorChart
                  data={SERRAGEM_SECA_FORNECEDORES}
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
                  value={SERRAGEM_SECA_KPIS.volumeEntregueYTD}
                  unit="ton"
                  status="default"
                  subtext="Total consolidado 2026"
                />
                <KpiCard
                  label="Volume previsto YTD"
                  value={SERRAGEM_SECA_KPIS.volumePrevistoYTD}
                  unit="ton"
                  status="default"
                  subtext="Meta acumulada"
                />
                <KpiCard
                  label="% Atendido"
                  value={`${SERRAGEM_SECA_KPIS.percentAtendido}%`}
                  status="success"
                  subtext="Meta superada em 4%"
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
            <span>Fonte de dados: SERRAGEM 2026.pbix</span>
            <span>•</span>
            <span className="text-[#38bdf8]">Semana Atual: 43</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

