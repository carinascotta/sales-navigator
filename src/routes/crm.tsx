import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import { Users, TrendingUp, DollarSign, Repeat } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { customerSegments, formatBRL, formatNumber } from "@/lib/mock-data";

export const Route = createFileRoute("/crm")({
  head: () => ({
    meta: [
      { title: "Painel CRM — VendaSmart" },
      { name: "description", content: "Segmentação de clientes, receita e valor de cada segmento." },
      { property: "og:title", content: "Painel CRM — VendaSmart" },
      { property: "og:description", content: "Segmentação de clientes e LTV por segmento." },
    ],
  }),
  component: CrmPage,
});

function CrmPage() {
  const totalClientes = customerSegments.reduce((s, x) => s + x.clientes, 0);
  const totalReceita = customerSegments.reduce((s, x) => s + x.receita, 0);
  const ticketMedio = totalReceita / customerSegments.reduce((s, x) => s + (x.frequencia > 0 ? x.clientes : 0), 0);
  const freqMedia = customerSegments.reduce((s, x) => s + x.frequencia * x.clientes, 0) / totalClientes;

  const kpis = [
    { label: "Base ativa", value: formatNumber(totalClientes), icon: Users },
    { label: "Receita CRM", value: formatBRL(totalReceita), icon: DollarSign },
    { label: "Ticket médio", value: formatBRL(Math.round(ticketMedio)), icon: TrendingUp },
    { label: "Freq. média/ano", value: freqMedia.toFixed(1), icon: Repeat },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Painel CRM</h1>
        <p className="text-sm text-muted-foreground">
          Segmentação de clientes — receita, ticket médio e frequência por segmento.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{k.label}</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">{k.value}</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/15 text-accent">
                <k.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de clientes</CardTitle>
            <CardDescription>Por segmento</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerSegments}
                  dataKey="clientes"
                  nameKey="nome"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={2}
                  stroke="var(--color-background)"
                  strokeWidth={2}
                >
                  {customerSegments.map((s) => (
                    <Cell key={s.id} fill={s.cor} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                  formatter={(v: number) => formatNumber(v)}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receita por segmento</CardTitle>
            <CardDescription>YTD</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerSegments}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis dataKey="nome" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                  formatter={(v: number) => formatBRL(v)}
                />
                <Bar dataKey="receita" radius={[6, 6, 0, 0]}>
                  {customerSegments.map((s) => (
                    <Cell key={s.id} fill={s.cor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhe dos segmentos</CardTitle>
          <CardDescription>Clique nos cartões para ver oportunidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {customerSegments.map((s) => (
              <div key={s.id} className="rounded-lg border border-border bg-card/60 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ background: s.cor }} />
                    <h3 className="text-base font-semibold">{s.nome}</h3>
                  </div>
                  <Badge variant="secondary">{formatNumber(s.clientes)} clientes</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{s.descricao}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Receita</div>
                    <div className="mt-0.5 font-medium tabular-nums">{formatBRL(s.receita)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Ticket</div>
                    <div className="mt-0.5 font-medium tabular-nums">{formatBRL(s.ticketMedio)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Freq./ano</div>
                    <div className="mt-0.5 font-medium tabular-nums">{s.frequencia.toFixed(1)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
