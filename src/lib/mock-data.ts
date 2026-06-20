// O Dashboard de Vendas usa dados reais consolidados de Bases_Workshop.xlsx.
export {
  kpis,
  salesByRegion,
  salesDataMetadata,
  salesMonthly,
  topProducts,
  topSellers,
} from "@/lib/sales-data";

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

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const formatNumber = (v: number) => v.toLocaleString("pt-BR");
