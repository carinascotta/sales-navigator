// Dados fictícios — serão substituídos por dados reais pela equipe de dev.

export const salesMonthly = [
  { mes: "Jan", receita: 1_240_000 },
  { mes: "Fev", receita: 1_080_000 },
  { mes: "Mar", receita: 1_410_000 },
  { mes: "Abr", receita: 1_520_000 },
  { mes: "Mai", receita: 1_690_000 },
  { mes: "Jun", receita: 1_780_000 },
  { mes: "Jul", receita: 1_860_000 },
  { mes: "Ago", receita: 1_920_000 },
  { mes: "Set", receita: 2_010_000 },
  { mes: "Out", receita: 2_180_000 },
  { mes: "Nov", receita: 2_410_000 },
  { mes: "Dez", receita: 2_690_000 },
];

export const salesByRegion = [
  { regional: "Sudeste", receita: 8_420_000, lojas: 42 },
  { regional: "Sul", receita: 4_120_000, lojas: 21 },
  { regional: "Nordeste", receita: 3_680_000, lojas: 24 },
  { regional: "Centro-Oeste", receita: 1_980_000, lojas: 11 },
  { regional: "Norte", receita: 1_240_000, lojas: 8 },
];

export const topProducts = [
  { sku: "TV-55-4K", nome: 'Smart TV 55" 4K', categoria: "Eletro", unidades: 4820, receita: 14_460_000 },
  { sku: "GEL-450L", nome: "Geladeira Frost Free 450L", categoria: "Eletro", unidades: 2110, receita: 8_440_000 },
  { sku: "CEL-PRO-256", nome: "Smartphone Pro 256GB", categoria: "Mobile", unidades: 6310, receita: 18_930_000 },
  { sku: "NOTE-I7", nome: "Notebook i7 16GB", categoria: "Informática", unidades: 1480, receita: 7_400_000 },
  { sku: "FONE-ANC", nome: "Fone Bluetooth ANC", categoria: "Áudio", unidades: 9120, receita: 4_560_000 },
  { sku: "AR-12K", nome: "Ar Condicionado 12.000 BTUs", categoria: "Climatização", unidades: 1820, receita: 5_460_000 },
];

export const topSellers = [
  { nome: "Ana Carvalho", regional: "Sudeste", receita: 1_240_000, deals: 312 },
  { nome: "Bruno Lima", regional: "Sul", receita: 980_000, deals: 271 },
  { nome: "Carla Mendes", regional: "Nordeste", receita: 870_000, deals: 248 },
  { nome: "Diego Souza", regional: "Sudeste", receita: 820_000, deals: 230 },
  { nome: "Eduarda Pires", regional: "Centro-Oeste", receita: 690_000, deals: 198 },
];

export const customerSegments = [
  {
    id: "vip",
    nome: "VIP",
    descricao: "Top 5% por receita; alta frequência e ticket alto",
    clientes: 1240,
    receita: 12_400_000,
    ticketMedio: 4820,
    frequencia: 8.2,
    cor: "var(--color-chart-1)",
  },
  {
    id: "fieis",
    nome: "Fiéis",
    descricao: "Compram 4+ vezes ao ano em múltiplas categorias",
    clientes: 5820,
    receita: 18_900_000,
    ticketMedio: 1240,
    frequencia: 5.4,
    cor: "var(--color-chart-2)",
  },
  {
    id: "ocasionais",
    nome: "Ocasionais",
    descricao: "1–3 compras por ano, sensíveis a campanhas",
    clientes: 18420,
    receita: 14_200_000,
    ticketMedio: 480,
    frequencia: 1.8,
    cor: "var(--color-chart-3)",
  },
  {
    id: "novos",
    nome: "Novos",
    descricao: "Primeira compra nos últimos 90 dias",
    clientes: 3240,
    receita: 2_100_000,
    ticketMedio: 320,
    frequencia: 1.1,
    cor: "var(--color-chart-4)",
  },
  {
    id: "inativos",
    nome: "Em risco",
    descricao: "Sem compras há 180+ dias; risco de churn",
    clientes: 7120,
    receita: 0,
    ticketMedio: 0,
    frequencia: 0,
    cor: "var(--color-chart-5)",
  },
];

export const kpis = {
  receitaAno: 19_400_000,
  variacaoReceita: 18.6,
  ticketMedio: 412,
  variacaoTicket: 4.2,
  pedidos: 47120,
  variacaoPedidos: 12.1,
  conversao: 3.8,
  variacaoConversao: -0.4,
};

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const formatNumber = (v: number) => v.toLocaleString("pt-BR");
