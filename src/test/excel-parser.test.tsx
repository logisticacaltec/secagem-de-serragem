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
  });

  it("dynamically considers week 45 as current week when Dt Movto column has 07/11/2026", () => {
    const wb = XLSX.utils.book_new();

    // Planilha idêntica à foto enviada pelo usuário (cargas de Serragem Seca)
    const cargasData = [
      {
        Est: 301,
        "Nr Carga": "694547",
        Emitente: "RCB",
        Movimento: "Recebimento",
        "Dt Movto": "06/11/2026",
        Item: "100010003",
        Descrição: "SERRAGEM SECA",
        Docto: "0008105",
        "Peso Líquido": "27.060",
        Situação: "Atualizado",
      },
      {
        Est: 301,
        "Nr Carga": "694558",
        Emitente: "RCB",
        Movimento: "Recebimento",
        "Dt Movto": "06/11/2026",
        Item: "100010003",
        Descrição: "SERRAGEM SECA",
        Docto: "0008106",
        "Peso Líquido": "26.600",
        Situação: "Atualizado",
      },
      {
        Est: 301,
        "Nr Carga": "694573",
        Emitente: "RCB",
        Movimento: "Recebimento",
        "Dt Movto": "07/11/2026",
        Item: "100010003",
        Descrição: "SERRAGEM SECA",
        Docto: "0008112",
        "Peso Líquido": "28.380",
        Situação: "Atualizado",
      },
      {
        Est: 301,
        "Nr Carga": "694604",
        Emitente: "RCB",
        Movimento: "Recebimento",
        "Dt Movto": "07/11/2026",
        Item: "100010003",
        Descrição: "SERRAGEM SECA",
        Docto: "0008114",
        "Peso Líquido": "27.840",
        Situação: "Atualizado",
      },
    ];

    const cWs = XLSX.utils.json_to_sheet(cargasData);
    XLSX.utils.book_append_sheet(wb, cWs, "Cargas");

    const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    const result = parseExcelData(buf, "cargas_serragem_0711.xlsx");

    // Deve considerar semana 45 como semana atual
    expect(result.currentSemana).toBe(45);
    expect(result.availableSemanas).toContain(45);

    // O estoque deve ter a semana 45 marcada como isCurrentWeek = true
    const estoque45 = result.estoquePrevisaoSemanas.find((s) => s.semana === 45);
    expect(estoque45).toBeDefined();
    expect(estoque45?.isCurrentWeek).toBe(true);

    // A série de Serragem Seca deve ter a semana 45 incluída
    const seca45 = result.secaSemanas.find((s) => s.semana === 45);
    expect(seca45).toBeDefined();
    expect(seca45?.volumeEntregue).toBeGreaterThan(0);
  });
});
