export interface MesData {
  mes: string;
  volumeEntregue: number;
  volumePrevisto: number;
  variacaoPercent: number;
}

export interface FornecedorData {
  fornecedor: string;
  volumeEntregue: number;
  valorMedio?: number;
}

export interface SemanaData {
  semana: number;
  volumeEntregue: number;
  volumePrevisto: number;
  percentAtendido: number;
  valorMedio?: number;
}

export interface EstoqueSemanalData {
  semana: number;
  estoque: number;
  estoqueB01: number;
  estoqueB02: number;
  consumoCaltec: number;
  previsaoRecebimento: number;
  entradaFabrica: number | null;
  isCurrentWeek?: boolean;
}

export interface KpiSummary {
  volumeEntregueYTD: number;
  volumePrevistoYTD: number;
  percentAtendido: number;
}

// 1. SERRAGEM SECADOR
export const SERRAGEM_SECADOR_KPIS: KpiSummary = {
  volumeEntregueYTD: 14187,
  volumePrevistoYTD: 16145,
  percentAtendido: 88,
};

export const SERRAGEM_SECADOR_MTD: MesData[] = [
  { mes: "junho", volumeEntregue: 1537, volumePrevisto: 1550, variacaoPercent: 99 },
  { mes: "Julho", volumeEntregue: 1382, volumePrevisto: 1550, variacaoPercent: 89 },
  { mes: "Agosto", volumeEntregue: 1315, volumePrevisto: 1650, variacaoPercent: 80 },
  { mes: "Setembro", volumeEntregue: 1291, volumePrevisto: 1650, variacaoPercent: 78 },
  { mes: "Outubro", volumeEntregue: 929, volumePrevisto: 1350, variacaoPercent: 69 },
];

export const SERRAGEM_SECADOR_FORNECEDORES: FornecedorData[] = [
  { fornecedor: "CLAUDINO REC", volumeEntregue: 7190 },
  { fornecedor: "MARQUES MARA", volumeEntregue: 4277 },
  { fornecedor: "GELENSKI 2", volumeEntregue: 2353 },
];

export const SERRAGEM_SECADOR_SEMANAS: SemanaData[] = [
  { semana: 34, volumeEntregue: 275, volumePrevisto: 425, percentAtendido: 65 },
  { semana: 35, volumeEntregue: 360, volumePrevisto: 425, percentAtendido: 85 },
  { semana: 36, volumeEntregue: 350, volumePrevisto: 350, percentAtendido: 100 },
  { semana: 37, volumeEntregue: 235, volumePrevisto: 350, percentAtendido: 67 },
  { semana: 38, volumeEntregue: 212, volumePrevisto: 350, percentAtendido: 60 },
  { semana: 39, volumeEntregue: 324, volumePrevisto: 275, percentAtendido: 118 },
  { semana: 40, volumeEntregue: 341, volumePrevisto: 300, percentAtendido: 114 },
  { semana: 41, volumeEntregue: 276, volumePrevisto: 350, percentAtendido: 79 },
  { semana: 42, volumeEntregue: 220, volumePrevisto: 400, percentAtendido: 55 },
  { semana: 43, volumeEntregue: 264, volumePrevisto: 400, percentAtendido: 66 },
];

// 2. SERRAGEM SECA
export const SERRAGEM_SECA_KPIS: KpiSummary = {
  volumeEntregueYTD: 41158,
  volumePrevistoYTD: 39675,
  percentAtendido: 104,
};

export const SERRAGEM_SECA_MTD: MesData[] = [
  { mes: "junho", volumeEntregue: 1867, volumePrevisto: 2800, variacaoPercent: 67 },
  { mes: "Julho", volumeEntregue: 1733, volumePrevisto: 2700, variacaoPercent: 64 },
  { mes: "Agosto", volumeEntregue: 2059, volumePrevisto: 3600, variacaoPercent: 57 },
  { mes: "Setembro", volumeEntregue: 2233, volumePrevisto: 2900, variacaoPercent: 77 },
  { mes: "Outubro", volumeEntregue: 1968, volumePrevisto: 2900, variacaoPercent: 68 },
];

export const SERRAGEM_SECA_FORNECEDORES: FornecedorData[] = [
  { fornecedor: "FOX ARTEFATO", volumeEntregue: 4935, valorMedio: 650 },
  { fornecedor: "RCB", volumeEntregue: 4756, valorMedio: 700 },
  { fornecedor: "VIDAL MAD 2", volumeEntregue: 3857, valorMedio: 485 },
  { fornecedor: "MF SCROCCARO", volumeEntregue: 3159, valorMedio: 650 },
  { fornecedor: "VOGEL COM", volumeEntregue: 3033, valorMedio: 600 },
  { fornecedor: "SÃO JOÃO 2", volumeEntregue: 3023, valorMedio: 750 },
  { fornecedor: "HP RESIDUOS", volumeEntregue: 2613, valorMedio: 650 },
  { fornecedor: "RESIPINUS", volumeEntregue: 2288, valorMedio: 550 },
  { fornecedor: "AGK MADEIRAS", volumeEntregue: 1793 },
  { fornecedor: "KLISMANN", volumeEntregue: 1590, valorMedio: 570 },
];

export const SERRAGEM_SECA_SEMANAS: SemanaData[] = [
  {
    semana: 36,
    volumeEntregue: 671,
    volumePrevisto: 620,
    valorMedio: 558.93,
    percentAtendido: 108,
  },
  {
    semana: 37,
    volumeEntregue: 638,
    volumePrevisto: 620,
    valorMedio: 562.64,
    percentAtendido: 103,
  },
  {
    semana: 38,
    volumeEntregue: 640,
    volumePrevisto: 620,
    valorMedio: 583.25,
    percentAtendido: 103,
  },
  {
    semana: 39,
    volumeEntregue: 695,
    volumePrevisto: 610,
    valorMedio: 595.99,
    percentAtendido: 114,
  },
  {
    semana: 40,
    volumeEntregue: 853,
    volumePrevisto: 620,
    valorMedio: 592.62,
    percentAtendido: 138,
  },
  {
    semana: 41,
    volumeEntregue: 850,
    volumePrevisto: 770,
    valorMedio: 622.42,
    percentAtendido: 110,
  },
  { semana: 42, volumeEntregue: 558, volumePrevisto: 795, valorMedio: 624.62, percentAtendido: 70 },
  { semana: 43, volumeEntregue: 697, volumePrevisto: 795, valorMedio: 592.21, percentAtendido: 88 },
];

// 3. ESTOQUE E PREVISÃO
export const ESTOQUE_PREVISAO_SEMANAS: EstoqueSemanalData[] = [
  {
    semana: 34,
    estoque: 3726,
    estoqueB01: 3050,
    estoqueB02: 1200,
    consumoCaltec: 1220,
    previsaoRecebimento: 1100,
    entradaFabrica: 886,
  },
  {
    semana: 35,
    estoque: 3780,
    estoqueB01: 3000,
    estoqueB02: 1250,
    consumoCaltec: 1220,
    previsaoRecebimento: 1100,
    entradaFabrica: 1213,
  },
  {
    semana: 36,
    estoque: 3681,
    estoqueB01: 2800,
    estoqueB02: 1350,
    consumoCaltec: 1150,
    previsaoRecebimento: 1120,
    entradaFabrica: 1020,
  },
  {
    semana: 37,
    estoque: 3537,
    estoqueB01: 2700,
    estoqueB02: 1400,
    consumoCaltec: 970,
    previsaoRecebimento: 1017,
    entradaFabrica: 873,
  },
  {
    semana: 38,
    estoque: 3245,
    estoqueB01: 2500,
    estoqueB02: 1300,
    consumoCaltec: 1143,
    previsaoRecebimento: 970,
    entradaFabrica: 852,
  },
  {
    semana: 39,
    estoque: 3183,
    estoqueB01: 2600,
    estoqueB02: 1250,
    consumoCaltec: 1050,
    previsaoRecebimento: 1082,
    entradaFabrica: 1019,
  },
  {
    semana: 40,
    estoque: 3286,
    estoqueB01: 2700,
    estoqueB02: 1300,
    consumoCaltec: 1050,
    previsaoRecebimento: 1092,
    entradaFabrica: 1092,
  },
  {
    semana: 41,
    estoque: 3305,
    estoqueB01: 2600,
    estoqueB02: 1400,
    consumoCaltec: 1120,
    previsaoRecebimento: 1106,
    entradaFabrica: 1126,
  },
  {
    semana: 42,
    estoque: 2933,
    estoqueB01: 2450,
    estoqueB02: 1350,
    consumoCaltec: 1150,
    previsaoRecebimento: 1195,
    entradaFabrica: 778,
  },
  {
    semana: 43,
    estoque: 2744,
    estoqueB01: 2400,
    estoqueB02: 1300,
    consumoCaltec: 1150,
    previsaoRecebimento: 1195,
    entradaFabrica: 961,
    isCurrentWeek: true,
  },
  {
    semana: 44,
    estoque: 2789,
    estoqueB01: 2450,
    estoqueB02: 1350,
    consumoCaltec: 1150,
    previsaoRecebimento: 1150,
    entradaFabrica: null,
  },
  {
    semana: 45,
    estoque: 3394,
    estoqueB01: 2800,
    estoqueB02: 1450,
    consumoCaltec: 1150,
    previsaoRecebimento: 1150,
    entradaFabrica: null,
  },
  {
    semana: 46,
    estoque: 3974,
    estoqueB01: 3150,
    estoqueB02: 1600,
    consumoCaltec: 1150,
    previsaoRecebimento: 1150,
    entradaFabrica: null,
  },
  {
    semana: 47,
    estoque: 4554,
    estoqueB01: 3500,
    estoqueB02: 1750,
    consumoCaltec: 1150,
    previsaoRecebimento: 1150,
    entradaFabrica: null,
  },
  {
    semana: 48,
    estoque: 5059,
    estoqueB01: 3850,
    estoqueB02: 1900,
    consumoCaltec: 1150,
    previsaoRecebimento: 1150,
    entradaFabrica: null,
  },
  {
    semana: 49,
    estoque: 5769,
    estoqueB01: 4200,
    estoqueB02: 2050,
    consumoCaltec: 1150,
    previsaoRecebimento: 1150,
    entradaFabrica: null,
  },
  {
    semana: 50,
    estoque: 6454,
    estoqueB01: 4600,
    estoqueB02: 2200,
    consumoCaltec: 1150,
    previsaoRecebimento: 1150,
    entradaFabrica: null,
  },
];
