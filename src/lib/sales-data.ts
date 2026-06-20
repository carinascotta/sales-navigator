// Dados consolidados de Bases_Workshop.xlsx.
// Período: 01/01/2025 a 25/12/2025.
// Receita por linha = units × net_price. Margem = receita − (units × unit_cost).

export const salesDataMetadata = {
  source: "Bases_Workshop.xlsx",
  periodStart: "2025-01-01",
  periodEnd: "2025-12-25",
  processedRows: 128_125,
  rejectedRows: 0,
  duplicateRows: 0,
  unmatchedProducts: 0,
  unmatchedSellers: 0,
  sourceMarginAnomalies: 2_724,
} as const;

export const salesMonthly = [
  { mes: "Jan", receita: 1_114_108.68, pedidos: 3_200, unidades: 5_176 },
  { mes: "Fev", receita: 1_658_887.3, pedidos: 4_800, unidades: 7_729 },
  { mes: "Mar", receita: 1_624_117.79, pedidos: 4_800, unidades: 7_633 },
  { mes: "Abr", receita: 1_671_797.93, pedidos: 4_800, unidades: 7_832 },
  { mes: "Mai", receita: 1_905_787.59, pedidos: 5_600, unidades: 8_927 },
  { mes: "Jun", receita: 2_198_670.82, pedidos: 6_400, unidades: 10_271 },
  { mes: "Jul", receita: 1_906_274, pedidos: 5_600, unidades: 8_871 },
  { mes: "Ago", receita: 1_922_469.3, pedidos: 5_600, unidades: 8_941 },
  { mes: "Set", receita: 2_207_558.9, pedidos: 6_400, unidades: 10_274 },
  { mes: "Out", receita: 2_461_331.28, pedidos: 7_200, unidades: 11_459 },
  { mes: "Nov", receita: 6_884_567.94, pedidos: 20_000, unidades: 32_112 },
  { mes: "Dez", receita: 1_910_419.74, pedidos: 5_600, unidades: 8_900 },
];

export const salesByRegion = [
  { regional: "Sudeste", receita: 9_593_486.14, pedidos: 27_998, unidades: 44_777 },
  { regional: "Online", receita: 5_497_011.87, pedidos: 15_979, unidades: 25_602 },
  { regional: "Centro-Oeste", receita: 4_159_101.4, pedidos: 12_158, unidades: 19_375 },
  { regional: "Norte", receita: 4_158_371.8, pedidos: 12_028, unidades: 19_396 },
  { regional: "Sul", receita: 4_058_020.06, pedidos: 11_837, unidades: 18_975 },
];

export const topProducts = [
  { id: 92, nome: "Calçado Model 92", categoria: "Calçados", unidades: 154, receita: 53_311.9, pedidos: 154 },
  { id: 492, nome: "Calçado Model 492", categoria: "Calçados", unidades: 142, receita: 49_232.74, pedidos: 142 },
  { id: 252, nome: "Calçado Model 252", categoria: "Calçados", unidades: 135, receita: 49_168.4, pedidos: 135 },
  { id: 475, nome: "Calçado Model 475", categoria: "Calçados", unidades: 142, receita: 49_012.09, pedidos: 142 },
  { id: 741, nome: "Calçado Model 741", categoria: "Calçados", unidades: 144, receita: 48_757.75, pedidos: 144 },
  { id: 265, nome: "Calçado Model 265", categoria: "Calçados", unidades: 145, receita: 48_509.48, pedidos: 145 },
];

export const topSellers = [
  { id: 9_999, nome: "ECOMM", regional: "Online", receita: 5_497_011.87, deals: 15_979, unidades: 25_602 },
  { id: 465, nome: "Seller_465", regional: "Sudeste", receita: 38_604.76, deals: 100, unidades: 181 },
  { id: 391, nome: "Seller_391", regional: "Sudeste", receita: 38_231.88, deals: 101, unidades: 178 },
  { id: 308, nome: "Seller_308", regional: "Sudeste", receita: 38_149.37, deals: 108, unidades: 166 },
  { id: 455, nome: "Seller_455", regional: "Sudeste", receita: 37_082.37, deals: 98, unidades: 167 },
];

export const kpis = {
  receitaAno: 27_465_991.27,
  ticketMedio: 343.32,
  pedidos: 80_000,
  unidades: 128_125,
  margemBruta: 45.79,
  variacaoReceita: null,
  variacaoTicket: null,
  variacaoPedidos: null,
  variacaoMargem: null,
} as const;
