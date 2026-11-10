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
  currentSemana?: number;
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
  currentSemana: 45,
  lastUpdated: "2026-11-07T18:00:00",
  sourceFileName: "SERRAGEM 2026.pbix (Consolidado - Semana 45)",
};

/**
 * Converte data para número da semana considerando domingo a sábado.
 * Ex: 01/11/2026 (domingo) até 07/11/2026 (sábado) = Semana 45.
 */
export function getSundayToSaturdayWeekNumber(d: Date): number {
  const year = d.getFullYear();
  // Domingo correspondente à semana da data d:
  const sunday = new Date(year, d.getMonth(), d.getDate() - d.getDay());

  // Primeiro domingo da Semana 1 de 2026 (iniciada em 28/12/2025 e finalizada em 03/01/2026)
  const w1Sunday = new Date(2025, 11, 28);
  const diffDays = Math.round((sunday.getTime() - w1Sunday.getTime()) / (1000 * 60 * 60 * 24));
  const weekNum = Math.floor(diffDays / 7) + 1;
  return Math.max(1, Math.min(52, weekNum));
}

/**
 * Converte valor de data de células do Excel (Date, serial numérico ou string DD/MM/AAAA)
 */
export function parseDateValue(val: any): Date | null {
  if (val === null || val === undefined || val === "") return null;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }
  if (typeof val === "number") {
    // Número serial do Excel (ex: 46333 = 07/11/2026)
    if (val > 30000 && val < 65000) {
      return new Date(Math.round((val - 25569) * 86400 * 1000 + 12 * 3600 * 1000));
    }
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    const num = parseFloat(trimmed);
    if (!isNaN(num) && num > 30000 && num < 65000 && /^\d+(\.\d+)?$/.test(trimmed)) {
      return new Date(Math.round((num - 25569) * 86400 * 1000 + 12 * 3600 * 1000));
    }
    const parts = trimmed.split(/[-/]/);
    if (parts.length === 3) {
      let y: number;
      let m: number;
      let day: number;
      if (parts[0].length === 4) {
        y = parseInt(parts[0], 10);
        m = parseInt(parts[1], 10) - 1;
        day = parseInt(parts[2], 10);
      } else {
        const p0 = parseInt(parts[0], 10);
        const p1 = parseInt(parts[1], 10);
        let p2 = parseInt(parts[2], 10);
        if (parts[2].length === 2) p2 = 2000 + p2;
        if (p1 > 12 && p0 <= 12) {
          m = p0 - 1;
          day = p1;
          y = p2;
        } else {
          day = p0;
          m = p1 - 1;
          y = p2;
        }
      }
      const d = new Date(y, m, day, 12, 0, 0);
      return isNaN(d.getTime()) ? null : d;
    }
  }
  return null;
}

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

  // 0. Varrer todas as abas procurando colunas de data como "Dt Movto", "Data Movimento", "Data"
  let maxDateFound: Date | null = null;
  let maxSemanaFromDtMovto: number | null = null;

  // Acumuladores caso o arquivo seja uma planilha bruta de cargas (ex: ERP Caltec com Dt Movto)
  const rawLoadsByWeek: {
    seca: Record<number, number>;
    secador: Record<number, number>;
  } = { seca: {}, secador: {} };
  const rawLoadsBySupplier: {
    seca: Record<string, number>;
    secador: Record<string, number>;
  } = { seca: {}, secador: {} };
  let rawLoadsTotalCount = 0;

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    if (!ws) continue;
    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws);
    if (!rows || rows.length === 0) continue;

    const sample = rows[0];
    const keys = Object.keys(sample);
    const dtKey =
      keys.find((k) => /^(dt[\s_.]*mov|data[\s_.]*mov|dtmovto|data$)/i.test(k.trim())) ||
      keys.find((k) => /dt[\s_.]*mov/i.test(k.trim())) ||
      keys.find((k) => /movto/i.test(k.trim()));

    const descKey = keys.find((k) => /^(descri|produto|item[\s_.]*desc)/i.test(k.trim()));
    const pesoKey = keys.find((k) => /^(peso[\s_.]*l[ií]quido|peso[\s_.]*liq|peso|volume|qtde)/i.test(k.trim()));
    const fornecKey = keys.find((k) => /^(emitente|fornecedor|parceiro|cliente)/i.test(k.trim()));
    const situacaoKey = keys.find((k) => /^(situa|status)/i.test(k.trim()));

    if (dtKey) {
      for (const r of rows) {
        if (situacaoKey && String(r[situacaoKey] || "").toLowerCase().includes("cancel")) {
          continue;
        }

        const dateVal = parseDateValue(r[dtKey]);
        if (dateVal) {
          if (!maxDateFound || dateVal.getTime() > maxDateFound.getTime()) {
            maxDateFound = dateVal;
          }
          const weekNum = getSundayToSaturdayWeekNumber(dateVal);
          maxSemanaFromDtMovto = Math.max(maxSemanaFromDtMovto || 0, weekNum);

          if (descKey && pesoKey) {
            const desc = String(r[descKey] || "").toUpperCase();
            let rawPeso = r[pesoKey];
            let pesoNum = 0;
            if (typeof rawPeso === "number") {
              pesoNum = rawPeso;
            } else if (typeof rawPeso === "string") {
              let clean = rawPeso.trim();
              if (clean.includes(".") && clean.includes(",")) {
                clean = clean.replace(/\./g, "").replace(",", ".");
              } else if (clean.includes(",")) {
                clean = clean.replace(",", ".");
              }
              pesoNum = parseFloat(clean) || 0;
            }
            // Converter de kg para ton se >= 100
            const pesoTon = pesoNum >= 100 ? pesoNum / 1000 : pesoNum;
            const fornec = fornecKey ? String(r[fornecKey] || "DIVERSOS").trim().toUpperCase() : "DIVERSOS";

            if (pesoTon > 0) {
              rawLoadsTotalCount++;
              if (desc.includes("SECADOR")) {
                rawLoadsByWeek.secador[weekNum] = (rawLoadsByWeek.secador[weekNum] || 0) + pesoTon;
                rawLoadsBySupplier.secador[fornec] = (rawLoadsBySupplier.secador[fornec] || 0) + pesoTon;
              } else if (desc.includes("SECA") || desc.includes("SERRAGEM")) {
                rawLoadsByWeek.seca[weekNum] = (rawLoadsByWeek.seca[weekNum] || 0) + pesoTon;
                rawLoadsBySupplier.seca[fornec] = (rawLoadsBySupplier.seca[fornec] || 0) + pesoTon;
              }
            }
          }
        }
      }
    }
  }

  // 1. Process "Previsão Semanal - Geral"
  const pSheet = wb.Sheets["Previsão Semanal - Geral"];
  const pRows: PrevisaoRow[] = pSheet ? XLSX.utils.sheet_to_json(pSheet) : [];

  const secadorSemanas: SemanaData[] = [];
  const secaSemanas: SemanaData[] = [];
  const secadorFornec: FornecedorData[] = [];
  const secaFornec: FornecedorData[] = [];
  const estoquePrevisaoSemanas: EstoqueSemanalData[] = [];
  const availableSemanasSet = new Set<number>();

  // Baseline mínimo é semana 45 (ou a semana correspondente à última Dt Movto encontrada)
  let maxSemanaComDados = maxSemanaFromDtMovto || 45;
  for (const r of pRows) {
    const sem = Number(r.SEMANA);
    if (!sem || isNaN(sem)) continue;
    availableSemanasSet.add(sem);

    const secRec = Number(r["RECEBIMENTO S. SECADOR"]) || 0;
    const secaRec = Number(r["RECEBIMENTO S. SECA"]) || 0;
    const entFab =
      r["ENTRADA FABRICA"] !== undefined && r["ENTRADA FABRICA"] !== ""
        ? Number(r["ENTRADA FABRICA"])
        : null;

    if (secRec > 0 || secaRec > 0 || (entFab !== null && entFab > 0)) {
      maxSemanaComDados = Math.max(maxSemanaComDados, sem);
    }
  }

  // Regra solicitada: Se houver Dt Movto informada, SEMPRE considerar como semana atual
  // a semana referente à última data que tem informação (ex: 07/11/2026 -> Semana 45)
  if (maxSemanaFromDtMovto && maxSemanaFromDtMovto >= maxSemanaComDados) {
    maxSemanaComDados = maxSemanaFromDtMovto;
  }
  availableSemanasSet.add(maxSemanaComDados);

  // 2. Processar séries semanais até a semana atual com dados
  for (const r of pRows) {
    const sem = Number(r.SEMANA);
    if (!sem || isNaN(sem)) continue;

    const secProj = Number(r["PROJEÇÃO SERRAGEM SECADOR"]) || 0;
    const secRec = Number(r["RECEBIMENTO S. SECADOR"]) || 0;
    const secPct = secProj > 0 ? Math.round((secRec / secProj) * 100) : 0;

    const secaProj = Number(r["PROJEÇÃO SERRAGEM SECA"]) || 0;
    const secaRec = Number(r["RECEBIMENTO S. SECA"]) || 0;
    const secaPct = secaProj > 0 ? Math.round((secaRec / secaProj) * 100) : 0;
    const valMedio = Number(r["Valor Média Produto"]) || undefined;

    // Serragem Secador: semanas de 34 em diante até a semana atual
    if (sem >= 34 && (sem <= maxSemanaComDados || secRec > 0)) {
      secadorSemanas.push({
        semana: sem,
        volumeEntregue: Math.round(secRec),
        volumePrevisto: Math.round(secProj),
        percentAtendido: secPct,
      });
    }

    // Serragem Seca: semanas de 36 em diante até a semana atual
    if (sem >= 36 && (sem <= maxSemanaComDados || secaRec > 0)) {
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

    if (sem >= 34 && sem <= 52) {
      estoquePrevisaoSemanas.push({
        semana: sem,
        estoque: Math.round(estoqueVal),
        estoqueB01: Math.round(b01),
        estoqueB02: Math.round(b02),
        consumoCaltec: Math.round(consCaltec),
        previsaoRecebimento: Math.round(prevRec),
        entradaFabrica: entFab !== null ? Math.round(entFab) : null,
        isCurrentWeek: sem === maxSemanaComDados,
      });
    }
  }

  secadorSemanas.sort((a, b) => a.semana - b.semana);
  secaSemanas.sort((a, b) => a.semana - b.semana);
  estoquePrevisaoSemanas.sort((a, b) => a.semana - b.semana);

  // Se a planilha enviada não tiver a aba "Previsão Semanal - Geral", mas tiver cargas com "Dt Movto"
  if (pRows.length === 0 && rawLoadsTotalCount > 0) {
    const baseSecador = [...DEFAULT_DATASET.secadorSemanas];
    const baseSeca = [...DEFAULT_DATASET.secaSemanas];

    for (const [wStr, vol] of Object.entries(rawLoadsByWeek.secador)) {
      const w = Number(wStr);
      availableSemanasSet.add(w);
      const existing = baseSecador.find((s) => s.semana === w);
      if (existing) {
        existing.volumeEntregue = Math.round(vol);
        existing.percentAtendido =
          existing.volumePrevisto > 0 ? Math.round((existing.volumeEntregue / existing.volumePrevisto) * 100) : 0;
      } else {
        baseSecador.push({
          semana: w,
          volumeEntregue: Math.round(vol),
          volumePrevisto: 350,
          percentAtendido: Math.round((vol / 350) * 100),
        });
      }
    }

    for (const [wStr, vol] of Object.entries(rawLoadsByWeek.seca)) {
      const w = Number(wStr);
      availableSemanasSet.add(w);
      const existing = baseSeca.find((s) => s.semana === w);
      if (existing) {
        existing.volumeEntregue = Math.round(vol);
        existing.percentAtendido =
          existing.volumePrevisto > 0 ? Math.round((existing.volumeEntregue / existing.volumePrevisto) * 100) : 0;
      } else {
        baseSeca.push({
          semana: w,
          volumeEntregue: Math.round(vol),
          volumePrevisto: 745,
          valorMedio: 638,
          percentAtendido: Math.round((vol / 745) * 100),
        });
      }
    }

    baseSecador.sort((a, b) => a.semana - b.semana);
    baseSeca.sort((a, b) => a.semana - b.semana);

    secadorSemanas.push(...baseSecador.filter((s) => s.semana <= maxSemanaComDados || s.volumeEntregue > 0));
    secaSemanas.push(...baseSeca.filter((s) => s.semana <= maxSemanaComDados || s.volumeEntregue > 0));

    for (const [fornec, vol] of Object.entries(rawLoadsBySupplier.secador)) {
      secadorFornec.push({ fornecedor: fornec, volumeEntregue: Math.round(vol) });
    }
    for (const [fornec, vol] of Object.entries(rawLoadsBySupplier.seca)) {
      secaFornec.push({ fornecedor: fornec, volumeEntregue: Math.round(vol) });
    }
  } else if (pRows.length > 0) {
    // Se a semana da Dt Movto não estava na aba de previsão, garantir inclusão na série
    if (rawLoadsByWeek.seca[maxSemanaComDados] && !secaSemanas.some((s) => s.semana === maxSemanaComDados)) {
      const vol = rawLoadsByWeek.seca[maxSemanaComDados];
      secaSemanas.push({
        semana: maxSemanaComDados,
        volumeEntregue: Math.round(vol),
        volumePrevisto: 745,
        valorMedio: 638,
        percentAtendido: Math.round((vol / 745) * 100),
      });
      secaSemanas.sort((a, b) => a.semana - b.semana);
    }
    if (rawLoadsByWeek.secador[maxSemanaComDados] && !secadorSemanas.some((s) => s.semana === maxSemanaComDados)) {
      const vol = rawLoadsByWeek.secador[maxSemanaComDados];
      secadorSemanas.push({
        semana: maxSemanaComDados,
        volumeEntregue: Math.round(vol),
        volumePrevisto: 350,
        percentAtendido: Math.round((vol / 350) * 100),
      });
      secadorSemanas.sort((a, b) => a.semana - b.semana);
    }
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
  if (!availableSemanas.includes(maxSemanaComDados)) {
    availableSemanas.push(maxSemanaComDados);
    availableSemanas.sort((a, b) => a - b);
  }

  const finalEstoque =
    estoquePrevisaoSemanas.length > 0
      ? estoquePrevisaoSemanas
      : ESTOQUE_PREVISAO_SEMANAS.map((item) => ({
          ...item,
          isCurrentWeek: item.semana === maxSemanaComDados,
        }));

  return {
    secadorKpis,
    secadorMtd: secadorMtd.some((m) => m.volumeEntregue > 0) ? secadorMtd : SERRAGEM_SECADOR_MTD,
    secadorFornecedores: secadorFornec.length > 0 ? secadorFornec : SERRAGEM_SECADOR_FORNECEDORES,
    secadorSemanas: secadorSemanas.length > 0 ? secadorSemanas : SERRAGEM_SECADOR_SEMANAS,

    secaKpis,
    secaMtd: secaMtd.some((m) => m.volumeEntregue > 0) ? secaMtd : SERRAGEM_SECA_MTD,
    secaFornecedores: secaFornec.length > 0 ? secaFornec : SERRAGEM_SECA_FORNECEDORES,
    secaSemanas: secaSemanas.length > 0 ? secaSemanas : SERRAGEM_SECA_SEMANAS,

    estoquePrevisaoSemanas: finalEstoque,
    availableSemanas:
      availableSemanas.length > 0 ? availableSemanas : DEFAULT_DATASET.availableSemanas,
    currentSemana: maxSemanaComDados,
    lastUpdated: new Date().toISOString(),
    sourceFileName: fileName,
  };
}
