// Segmentação consolidada de Bases_Workshop.xlsx em 25/12/2025.
// Valor: gasto acumulado em 2025. Recência: dias desde a última compra.

export const crmSummary = {
  clientes: 34_406,
  receita: 27_465_991.27,
  ativos: 20_591,
  emRisco: 6_084,
  inativos: 7_731,
  taxaAtivos: 59.8,
} as const;

export const valueSegments = [
  {
    id: "ouro",
    nome: "Ouro",
    regra: "R$ 1.100 ou mais nos últimos 12 meses",
    clientes: 6_897,
    receita: 14_981_928.13,
    receitaPct: 54.5,
    gastoMedio: 2_172.24,
    pedidosMedios: 5.89,
    recenciaMediana: 31,
    cor: "#C69A43",
  },
  {
    id: "prata",
    nome: "Prata",
    regra: "Entre R$ 500 e R$ 1.099 nos últimos 12 meses",
    clientes: 10_512,
    receita: 7_711_289.01,
    receitaPct: 28.1,
    gastoMedio: 733.57,
    pedidosMedios: 1.81,
    recenciaMediana: 58,
    cor: "#999189",
  },
  {
    id: "bronze",
    nome: "Bronze",
    regra: "Menos de R$ 500 nos últimos 12 meses",
    clientes: 16_997,
    receita: 4_772_774.13,
    receitaPct: 17.4,
    gastoMedio: 280.8,
    pedidosMedios: 1.2,
    recenciaMediana: 100,
    cor: "#B66F47",
  },
];

export const recencySegments = [
  {
    id: "ativo",
    nome: "Ativo",
    regra: "Última compra há até 90 dias",
    clientes: 20_591,
    clientesPct: 59.8,
    receita: 21_051_543.21,
    receitaPct: 76.6,
    gastoMedio: 1_022.37,
    pedidosMedios: 2.98,
    recenciaMediana: 36,
    cor: "var(--color-success)",
  },
  {
    id: "risco",
    nome: "Em risco",
    regra: "Última compra entre 91 e 180 dias",
    clientes: 6_084,
    clientesPct: 17.7,
    receita: 3_209_652.81,
    receitaPct: 11.7,
    gastoMedio: 527.56,
    pedidosMedios: 1.54,
    recenciaMediana: 129,
    cor: "var(--color-warning)",
  },
  {
    id: "inativo",
    nome: "Inativo",
    regra: "Última compra há mais de 180 dias",
    clientes: 7_731,
    clientesPct: 22.5,
    receita: 3_204_795.25,
    receitaPct: 11.7,
    gastoMedio: 414.54,
    pedidosMedios: 1.2,
    recenciaMediana: 249,
    cor: "var(--color-destructive)",
  },
];

export const valueRecencyMatrix = [
  { segmento: "Ouro", ativo: 6_213, risco: 471, inativo: 213, total: 6_897 },
  { segmento: "Prata", ativo: 6_361, risco: 2_052, inativo: 2_099, total: 10_512 },
  { segmento: "Bronze", ativo: 8_017, risco: 3_561, inativo: 5_419, total: 16_997 },
];
