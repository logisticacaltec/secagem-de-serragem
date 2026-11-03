import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import { parseExcelData } from "@/lib/excel-parser";

describe("Excel Parser", () => {
  it("parses minimal valid workbook buffer", () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Previsão Semanal - Geral
    const pData = [
      {
        SEMANA: 43,
        "PROJEÇÃO SERRAGEM SECADOR": 400,
        "RECEBIMENTO S. SECADOR": 264,
        "PROJEÇÃO SERRAGEM SECA": 795,
        "RECEBIMENTO S. SECA": 697,
        "Valor Média Produto": 592.21,
        "CONSUMO BARRACAO 2": 2744,
        "ESTOQUE B 01": 1829,
        "ESTOQUE B 02": 915,
        "CONSUMO CALTEC seerragem": 1150,
        "PREVISÃO RECEBIMENTO": 1195,
        "ENTRADA FABRICA": 961,
      },
    ];
    const pWs = XLSX.utils.json_to_sheet(pData);
    XLSX.utils.book_append_sheet(wb, pWs, "Previsão Semanal - Geral");

    // Sheet 2: Resumo por fornecedor
    const rData = [
      {
        FORNECEDOR: "CLAUDINO REC",
        "VOLUME ENTREGUE ": 7190,
        PRODUTO: "SERRAGEM SECADOR",
      },
      {
        FORNECEDOR: "FOX ARTEFATO",
        "VOLUME ENTREGUE ": 4935,
        PRODUTO: "SERRAGEM SECA",
        " VALOR ": 650,
      },
    ];
    const rWs = XLSX.utils.json_to_sheet(rData);
    XLSX.utils.book_append_sheet(wb, rWs, "Resumo por fornecedor");

    const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    const result = parseExcelData(buf, "teste.xlsx");

    expect(result.sourceFileName).toBe("teste.xlsx");
    expect(result.secadorFornecedores.length).toBeGreaterThan(0);
    expect(result.secadorFornecedores[0].fornecedor).toBe("CLAUDINO REC");
    expect(result.secadorFornecedores[0].volumeEntregue).toBe(7190);

    const sem43 = result.estoquePrevisaoSemanas.find((s) => s.semana === 43);
    expect(sem43).toBeDefined();
    expect(sem43?.estoque).toBe(2744);
    expect(sem43?.entradaFabrica).toBe(961);
  });

  it("correctly includes week 44 in weekly series and estoque", () => {
    const wb = XLSX.utils.book_new();

    const pData = [
      {
        SEMANA: 44,
        "PROJEÇÃO SERRAGEM SECADOR": 350,
        "RECEBIMENTO S. SECADOR": 245,
        "PROJEÇÃO SERRAGEM SECA": 745,
        "RECEBIMENTO S. SECA": 569,
        "Valor Média Produto": 638,
        "CONSUMO BARRACAO 2": 2789,
        "ESTOQUE B 01": 2450,
        "ESTOQUE B 02": 1350,
        "CONSUMO CALTEC seerragem": 1150,
        "PREVISÃO RECEBIMENTO": 1150,
        "ENTRADA FABRICA": 814,
      },
    ];
    const pWs = XLSX.utils.json_to_sheet(pData);
    XLSX.utils.book_append_sheet(wb, pWs, "Previsão Semanal - Geral");

    const rData = [
      {
        FORNECEDOR: "FOX ARTEFATO",
        "VOLUME ENTREGUE ": 500,
        PRODUTO: "SERRAGEM SECA",
      },
    ];
    const rWs = XLSX.utils.json_to_sheet(rData);
    XLSX.utils.book_append_sheet(wb, rWs, "Resumo por fornecedor");

    const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    const result = parseExcelData(buf, "semana44.xlsx");

    const seca44 = result.secaSemanas.find((s) => s.semana === 44);
    expect(seca44).toBeDefined();
    expect(seca44?.volumeEntregue).toBe(569);
    expect(seca44?.volumePrevisto).toBe(745);

    const secador44 = result.secadorSemanas.find((s) => s.semana === 44);
    expect(secador44).toBeDefined();
    expect(secador44?.volumeEntregue).toBe(245);

    const estoque44 = result.estoquePrevisaoSemanas.find((s) => s.semana === 44);
    expect(estoque44).toBeDefined();
    expect(estoque44?.estoque).toBe(2789);
    expect(estoque44?.isCurrentWeek).toBe(true);
  });
});
