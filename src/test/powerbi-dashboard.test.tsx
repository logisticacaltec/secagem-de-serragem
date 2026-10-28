import { describe, expect, it } from "vitest";
import {
  SERRAGEM_SECADOR_KPIS,
  SERRAGEM_SECA_KPIS,
  ESTOQUE_PREVISAO_SEMANAS,
} from "@/data/serragem-data";

describe("Power BI Data Integrity", () => {
  it("has exact YTD values for Serragem Secador", () => {
    expect(SERRAGEM_SECADOR_KPIS.volumeEntregueYTD).toBe(14187);
    expect(SERRAGEM_SECADOR_KPIS.volumePrevistoYTD).toBe(16145);
    expect(SERRAGEM_SECADOR_KPIS.percentAtendido).toBe(88);
  });

  it("has exact YTD values for Serragem Seca", () => {
    expect(SERRAGEM_SECA_KPIS.volumeEntregueYTD).toBe(41158);
    expect(SERRAGEM_SECA_KPIS.volumePrevistoYTD).toBe(39675);
    expect(SERRAGEM_SECA_KPIS.percentAtendido).toBe(104);
  });

  it("has week 43 marked as current week with exact numbers in Estoque e Previsão", () => {
    const sem43 = ESTOQUE_PREVISAO_SEMANAS.find((s) => s.semana === 43);
    expect(sem43).toBeDefined();
    expect(sem43?.isCurrentWeek).toBe(true);
    expect(sem43?.estoque).toBe(2744);
    expect(sem43?.entradaFabrica).toBe(961);
    expect(sem43?.consumoCaltec).toBe(1150);
    expect(sem43?.previsaoRecebimento).toBe(1195);
  });
});
