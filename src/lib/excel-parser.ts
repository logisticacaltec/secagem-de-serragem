import * as XLSX from "xlsx";
import {
  type MesData,
  type FornecedorData,
  type SemanaData,
  type EstoqueSemanalData,
  type KpiSummary,
  SERRAGEM_SECADOR_KPIS,
  SERRAGEM_SECADOR_MTD,
  SERRAGEM_SECADOR_FORNECEDORES,
  SERRAGEM_SECADOR_SEMANAS,
  SERRAGEM_SECA_KPIS,
  SERRAGEM_SECA_MTD,
  SERRAGEM_SECA_FORNECEDORES,
  SERRAGEM_SECA_SEMANAS,
  ESTOQUE_PREVISAO_SEMANAS,
} from "@/data/serragem-data";

export interface DashboardDataset {
  secadorKpis: KpiSummary;
  secadorMtd: MesData[];
  secadorFornecedores: FornecedorData[];
  secadorSemanas: SemanaData[];

  secaKpis: KpiSummary;
  secaMtd: MesData[];
  secaFornecedores: FornecedorData[];
  secaSemanas: SemanaData[];

  estoquePrevisaoSemanas: EstoqueSemanalData[];
  availableSemanas: number[];
  lastUpdated: string;
  sourceFileName: string;
}

export const DEFAULT_DATASET: DashboardDataset = {
  secadorKpis: SERRAGEM_SECADOR_KPIS,
  secadorMtd: SERRAGEM_SECADOR_MTD,
  secadorFornecedores: SERRAGEM_SECADOR_FORNECEDORES,
  secadorSemanas: SERRAGEM_SECADOR_SEMANAS,

  secaKpis: SERRAGEM_SECA_KPIS,
  secaMtd: SERRAGEM_SECA_MTD,
  secaFornecedores: SERRAGEM_SECA_FORNECEDORES,
  secaSemanas: SERRAGEM_SECA_SEMANAS,

  estoquePrevisaoSemanas: ESTOQUE_PREVISAO_SEMANAS,
  availableSemanas: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
  lastUpdated: "2026-10-28T14:30:00",
  sourceFileName: "SERRAGEM 2026.pbix (Consolidado)",
};

interface PrevisaoRow {
  SEMANA?: number | string;
  "PROJEÇÃO SERRAGEM SECADOR"?: number | string;
  "RECEBIMENTO S. SECADOR"?: number | string;
  "PROJEÇÃO SERRAGEM SECA"?: number | string;
  "RECEBIMENTO S. SECA"?: number | string;
  "Valor Média Produto"?: number | string;
  "CONSUMO BARRACAO 2"?: number | string;
  "ESTOQUE FABRICA"?: number | string;
  "ESTOQUE B 01"?: number | string;
  "ESTOQUE B 02"?: number | string;
  "CONSUMO CALTEC seerragem"?: number | string;
  "PREVISÃO RECEBIMENTO"?: number | string;
  "ENTRADA FABRICA"?: number | string;
}

interface MensalRow {
  PRODUTO?: string;
  MÊS?: string;
  "VOLUME ENTREGUE "?: number | string;
  "VOLUME PREVISTO"?: number | string;
}

interface FornecedorRow {
  PRODUTO?: string;
  FORNECEDOR?: string;
  "VOLUME ENTREGUE "?: number | string;
  " VALOR "?: number | string;
  VALOR?: number | string;
}

export function parseExcelData(
  buffer: ArrayBuffer | Uint8Array,
  fileName: string,
): DashboardDataset {
  const wb = XLSX.read(buffer, { type: "array" });

  // 1. Process "Previsão Semanal - Geral"
  const pSheet = wb.Sheets["Previsão Semanal - Geral"];
  const pRows: PrevisaoRow[] = pSheet ? XLSX.utils.sheet_to_json(pSheet) : [];

  const secadorSemanas: SemanaData[] = [];
  const secaSemanas: SemanaData[] = [];
  const estoquePrevisaoSemanas: EstoqueSemanalData[] = [];
  const availableSemanasSet = new Set<number>();

  let maxSemanaComEntrada = 43;

  for (const r of pRows) {
    const sem = Number(r.SEMANA);
    if (!sem || isNaN(sem)) continue;
    availableSemanasSet.add(sem);

    const secProj = Number(r["PROJEÇÃO SERRAGEM SECADOR"]) || 0;
    const secRec = Number(r["RECEBIMENTO S. SECADOR"]) || 0;
    const secPct = secProj > 0 ? Math.round((secRec / secProj) * 100) : 0;

    const secaProj = Number(r["PROJEÇÃO SERRAGEM SECA"]) || 0;
    const secaRec = Number(r["RECEBIMENTO S. SECA"]) || 0;
    const secaPct = secaProj > 0 ? Math.round((secaRec / secaProj) * 100) : 0;
    const valMedio = Number(r["Valor Média Produto"]) || undefined;

    if (sem >= 34 && sem <= 43) {
      secadorSemanas.push({
        semana: sem,
        volumeEntregue: Math.round(secRec),
        volumePrevisto: Math.round(secProj),
        percentAtendido: secPct,
      });
    }

    if (sem >= 36 && sem <= 43) {
      secaSemanas.push({
        semana: sem,
        volumeEntregue: Math.round(secaRec),
        volumePrevisto: Math.round(secaProj),
        percentAtendido: secaPct,
        valorMedio: valMedio ? Math.round(valMedio * 100) / 100 : undefined,
      });
    }

    const estoqueVal = Number(r["CONSUMO BARRACAO 2"]) || Number(r["ESTOQUE FABRICA"]) || 0;
    const b01 = Number(r["ESTOQUE B 01"]) || 0;
    const b02 = Number(r["ESTOQUE B 02"]) || 0;
    const consCaltec = Number(r["CONSUMO CALTEC seerragem"]) || 0;
    const prevRec = Number(r["PREVISÃO RECEBIMENTO"]) || 0;
    const entFab =
      r["ENTRADA FABRICA"] !== undefined && r["ENTRADA FABRICA"] !== ""
        ? Number(r["ENTRADA FABRICA"])
        : null;

    if (entFab !== null && entFab > 0) {
      maxSemanaComEntrada = Math.max(maxSemanaComEntrada, sem);
    }

    if (sem >= 34 && sem <= 50) {
      estoquePrevisaoSemanas.push({
        semana: sem,
        estoque: Math.round(estoqueVal),
        estoqueB01: Math.round(b01),
        estoqueB02: Math.round(b02),
        consumoCaltec: Math.round(consCaltec),
        previsaoRecebimento: Math.round(prevRec),
        entradaFabrica: entFab !== null ? Math.round(entFab) : null,
        isCurrentWeek: sem === 43,
      });
    }
  }

  // Ensure current week is marked accurately
  for (const item of estoquePrevisaoSemanas) {
    item.isCurrentWeek = item.semana === maxSemanaComEntrada;
  }

  // 2. Process "Mensal por fornecedor"
  const mSheet = wb.Sheets["Mensal por fornecedor"];
  const mRows: MensalRow[] = mSheet ? XLSX.utils.sheet_to_json(mSheet) : [];

  const mesesDesejados = ["junho", "Julho", "Agosto", "Setembro", "Outubro"];
  const secadorMtdMap: Record<string, MesData> = {};
  const secaMtdMap: Record<string, MesData> = {};

  for (const m of mesesDesejados) {
    secadorMtdMap[m.toLowerCase()] = {
      mes: m,
      volumeEntregue: 0,
      volumePrevisto: 0,
      variacaoPercent: 0,
    };
    secaMtdMap[m.toLowerCase()] = {
      mes: m,
      volumeEntregue: 0,
      volumePrevisto: 0,
      variacaoPercent: 0,
    };
  }

  for (const r of mRows) {
    const prod = (r.PRODUTO || "").toString();
    const mesRaw = (r.MÊS || "").toString().toLowerCase();
    const entregue = Number(r["VOLUME ENTREGUE "]) || 0;
    const previsto = Number(r["VOLUME PREVISTO"]) || 0;

    if (prod.includes("SECADOR") && secadorMtdMap[mesRaw]) {
      secadorMtdMap[mesRaw].volumeEntregue += entregue;
      secadorMtdMap[mesRaw].volumePrevisto += previsto;
    } else if (prod === "SERRAGEM SECA" && secaMtdMap[mesRaw]) {
      secaMtdMap[mesRaw].volumeEntregue += entregue;
      secaMtdMap[mesRaw].volumePrevisto += previsto;
    }
  }

  const secadorMtd = mesesDesejados.map((m) => {
    const item = secadorMtdMap[m.toLowerCase()];
    const pct =
      item.volumePrevisto > 0 ? Math.round((item.volumeEntregue / item.volumePrevisto) * 100) : 0;
    return {
      mes: m,
      volumeEntregue: Math.round(item.volumeEntregue),
      volumePrevisto: Math.round(item.volumePrevisto),
      variacaoPercent: pct,
    };
  });

  const secaMtd = mesesDesejados.map((m) => {
    const item = secaMtdMap[m.toLowerCase()];
    const pct =
      item.volumePrevisto > 0 ? Math.round((item.volumeEntregue / item.volumePrevisto) * 100) : 0;
    return {
      mes: m,
      volumeEntregue: Math.round(item.volumeEntregue),
      volumePrevisto: Math.round(item.volumePrevisto),
      variacaoPercent: pct,
    };
  });

  // 3. Process "Resumo por fornecedor"
  const rSheet = wb.Sheets["Resumo por fornecedor"];
  const rRows: FornecedorRow[] = rSheet ? XLSX.utils.sheet_to_json(rSheet) : [];

  const secadorFornec: FornecedorData[] = [];
  const secaFornec: FornecedorData[] = [];

  for (const r of rRows) {
    const prod = (r.PRODUTO || "").toString();
    const nome = (r.FORNECEDOR || "").toString().trim();
    const entregue = Number(r["VOLUME ENTREGUE "]) || 0;
    const valor = Number(r[" VALOR "]) || Number(r.VALOR) || undefined;

    if (!nome || entregue <= 0) continue;

    if (prod.includes("SECADOR")) {
      secadorFornec.push({
        fornecedor: nome,
        volumeEntregue: Math.round(entregue),
        valorMedio: valor,
      });
    } else if (prod === "SERRAGEM SECA") {
      secaFornec.push({
        fornecedor: nome,
        volumeEntregue: Math.round(entregue),
        valorMedio: valor,
      });
    }
  }

  secadorFornec.sort((a, b) => b.volumeEntregue - a.volumeEntregue);
  secaFornec.sort((a, b) => b.volumeEntregue - a.volumeEntregue);

  // 4. Calculate YTD KPIs
  const totalSecadorEntregue = secadorFornec.reduce((acc, curr) => acc + curr.volumeEntregue, 0);
  const totalSecaEntregue = secaFornec.reduce((acc, curr) => acc + curr.volumeEntregue, 0);

  const secadorKpis: KpiSummary = {
    volumeEntregueYTD:
      totalSecadorEntregue > 0 ? totalSecadorEntregue : SERRAGEM_SECADOR_KPIS.volumeEntregueYTD,
    volumePrevistoYTD: SERRAGEM_SECADOR_KPIS.volumePrevistoYTD,
    percentAtendido:
      totalSecadorEntregue > 0
        ? Math.round((totalSecadorEntregue / SERRAGEM_SECADOR_KPIS.volumePrevistoYTD) * 100)
        : SERRAGEM_SECADOR_KPIS.percentAtendido,
  };

  const secaKpis: KpiSummary = {
    volumeEntregueYTD:
      totalSecaEntregue > 0 ? totalSecaEntregue : SERRAGEM_SECA_KPIS.volumeEntregueYTD,
    volumePrevistoYTD: SERRAGEM_SECA_KPIS.volumePrevistoYTD,
    percentAtendido:
      totalSecaEntregue > 0
        ? Math.round((totalSecaEntregue / SERRAGEM_SECA_KPIS.volumePrevistoYTD) * 100)
        : SERRAGEM_SECA_KPIS.percentAtendido,
  };

  const availableSemanas = Array.from(availableSemanasSet).sort((a, b) => a - b);

  return {
    secadorKpis,
    secadorMtd: secadorMtd.some((m) => m.volumeEntregue > 0) ? secadorMtd : SERRAGEM_SECADOR_MTD,
    secadorFornecedores: secadorFornec.length > 0 ? secadorFornec : SERRAGEM_SECADOR_FORNECEDORES,
    secadorSemanas: secadorSemanas.length > 0 ? secadorSemanas : SERRAGEM_SECADOR_SEMANAS,

    secaKpis,
    secaMtd: secaMtd.some((m) => m.volumeEntregue > 0) ? secaMtd : SERRAGEM_SECA_MTD,
    secaFornecedores: secaFornec.length > 0 ? secaFornec : SERRAGEM_SECA_FORNECEDORES,
    secaSemanas: secaSemanas.length > 0 ? secaSemanas : SERRAGEM_SECA_SEMANAS,

    estoquePrevisaoSemanas:
      estoquePrevisaoSemanas.length > 0 ? estoquePrevisaoSemanas : ESTOQUE_PREVISAO_SEMANAS,
    availableSemanas:
      availableSemanas.length > 0 ? availableSemanas : DEFAULT_DATASET.availableSemanas,
    lastUpdated: new Date().toISOString(),
    sourceFileName: fileName,
  };
}
