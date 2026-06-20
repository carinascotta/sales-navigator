import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, DollarSign, ShoppingCart, Target, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  salesMonthly, salesByRegion, topProducts, topSellers, kpis, formatBRL, formatNumber,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard de Vendas — VendaSmart" },
      { name: "description", content: "Histórico de vendas, performance por produto e por regional." },
      { property: "og:title", content: "Dashboard de Vendas — VendaSmart" },
      { property: "og:description", content: "Histórico de vendas, performance por produto e por regional." },
    ],
  }),
  component: Dashboard,
});

function KpiCard({
  label, value, delta, icon: Icon,
}: { label: string; value: string; delta: number; icon: typeof DollarSign }) {
  const up = delta >= 0;
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
          <div className={`mt-2 flex items-center gap-1 text-xs ${up ? "text-success" : "text-destructive"}`}>
            {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(delta).toFixed(1)}% vs período anterior
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard de Vendas</h1>
        <p className="text-sm text-muted-foreground">Acompanhamento de receita, produtos e regionais — dados fictícios.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Receita YTD" value={formatBRL(kpis.receitaAno)} delta={kpis.variacaoReceita} icon={DollarSign} />
        <KpiCard label="Ticket médio" value={formatBRL(kpis.ticketMedio)} delta={kpis.variacaoTicket} icon={Receipt} />
        <KpiCard label="Pedidos" value={formatNumber(kpis.pedidos)} delta={kpis.variacaoPedidos} icon={ShoppingCart} />
        <KpiCard label="Conversão" value={`${kpis.conversao}%`} delta={kpis.variacaoConversao} icon={Target} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Receita mensal</CardTitle>
            <CardDescription>Últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesMonthly} margin={{ left: 8, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    color: "var(--color-popover-foreground)",
                  }}
                  formatter={(v: number) => formatBRL(v)}
                />
                <Area type="monotone" dataKey="receita" stroke="var(--color-chart-1)" fill="url(#g1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receita por regional</CardTitle>
            <CardDescription>YTD</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByRegion} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} />
                <YAxis type="category" dataKey="regional" stroke="var(--color-muted-foreground)" fontSize={12} width={92} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                  formatter={(v: number) => formatBRL(v)}
                />
                <Bar dataKey="receita" fill="var(--color-chart-2)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top produtos</CardTitle>
            <CardDescription>Por receita YTD</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Unidades</TableHead>
                  <TableHead className="text-right">Receita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((p) => (
                  <TableRow key={p.sku}>
                    <TableCell>
                      <div className="font-medium">{p.nome}</div>
                      <div className="text-xs text-muted-foreground">{p.sku}</div>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{p.categoria}</Badge></TableCell>
                    <TableCell className="text-right tabular-nums">{formatNumber(p.unidades)}</TableCell>
                    <TableCell className="text-right tabular-nums font-medium">{formatBRL(p.receita)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top vendedores</CardTitle>
            <CardDescription>Ranking por receita</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Regional</TableHead>
                  <TableHead className="text-right">Deals</TableHead>
                  <TableHead className="text-right">Receita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSellers.map((s) => (
                  <TableRow key={s.nome}>
                    <TableCell className="font-medium">{s.nome}</TableCell>
                    <TableCell className="text-muted-foreground">{s.regional}</TableCell>
                    <TableCell className="text-right tabular-nums">{s.deals}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatBRL(s.receita)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
