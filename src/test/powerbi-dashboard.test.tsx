import { describe, expect, it } from "vitest";
import {
  SERRAGEM_SECADOR_KPIS,
  SERRAGEM_SECA_KPIS,
  ESTOQUE_PREVISAO_SEMANAS,
} from "@/data/serragem-data";

describe("Power BI Data Integrity", () => {
  it("has exact YTD values for Serragem Secador", () => {
    expect(SERRAGEM_SECADOR_KPIS.volumeEntregueYTD).toBeGreaterThan(0);
    expect(SERRAGEM_SECADOR_KPIS.volumePrevistoYTD).toBe(16145);
    expect(SERRAGEM_SECADOR_KPIS.percentAtendido).toBeGreaterThan(80);
  });

  it("has exact YTD values for Serragem Seca", () => {
    expect(SERRAGEM_SECA_KPIS.volumeEntregueYTD).toBeGreaterThan(40000);
    expect(SERRAGEM_SECA_KPIS.volumePrevistoYTD).toBe(39675);
    expect(SERRAGEM_SECA_KPIS.percentAtendido).toBeGreaterThanOrEqual(100);
  });

  it("has week 45 marked as current week with exact numbers in Estoque e Previsão", () => {
    const sem45 = ESTOQUE_PREVISAO_SEMANAS.find((s) => s.semana === 45);
    expect(sem45).toBeDefined();
    expect(sem45?.isCurrentWeek).toBe(true);
    expect(sem45?.estoque).toBe(3394);
    expect(sem45?.consumoCaltec).toBe(1150);
    expect(sem45?.previsaoRecebimento).toBe(1150);
  });
});
