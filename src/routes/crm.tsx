import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { CircleAlert, CircleCheck, Clock3, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { crmSummary, recencySegments, valueRecencyMatrix, valueSegments } from "@/lib/crm-data";
import { formatBRL, formatNumber } from "@/lib/mock-data";

export const Route = createFileRoute("/crm")({
  head: () => ({
    meta: [
      { title: "Painel CRM — VendaSmart" },
      { name: "description", content: "Segmentação de clientes por valor e recência." },
    ],
  }),
  component: CrmPage,
});

const tooltipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
};

function CrmPage() {
  const kpis = [
    { label: "Clientes", value: formatNumber(crmSummary.clientes), detail: "Base identificada", icon: Users },
    { label: "Ativos", value: formatNumber(crmSummary.ativos), detail: `${crmSummary.taxaAtivos}% da base`, icon: CircleCheck },
    { label: "Em risco", value: formatNumber(crmSummary.emRisco), detail: "91 a 180 dias", icon: CircleAlert },
    { label: "Inativos", value: formatNumber(crmSummary.inativos), detail: "Mais de 180 dias", icon: Clock3 },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Painel CRM</h1>
        <p className="text-sm text-muted-foreground">
          Segmentação por valor e recência — posição em 25 de dezembro de 2025.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{k.label}</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">{k.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{k.detail}</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary">
                <k.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Segmentação por valor</CardTitle>
            <CardDescription>Participação de clientes em Ouro, Prata e Bronze</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={valueSegments} dataKey="clientes" nameKey="nome" innerRadius={62} outerRadius={112} paddingAngle={3}>
                  {valueSegments.map((s) => <Cell key={s.id} fill={s.cor} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatNumber(v)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recência da base</CardTitle>
            <CardDescription>Dias desde a última compra</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recencySegments}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis dataKey="nome" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={(v) => `${Math.round(v / 1000)} mil`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatNumber(v)} />
                <Bar dataKey="clientes" radius={[6, 6, 0, 0]}>
                  {recencySegments.map((s) => <Cell key={s.id} fill={s.cor} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regras de recência</CardTitle>
          <CardDescription>Status complementar ao segmento de valor</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {recencySegments.map((s) => (
            <div key={s.id} className="rounded-lg border border-border bg-card/70 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: s.cor }} />
                  <h3 className="font-semibold">{s.nome}</h3>
                </div>
                <Badge variant="secondary">{s.clientesPct}% da base</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{s.regra}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div><div className="text-muted-foreground">Clientes</div><div className="mt-0.5 font-medium">{formatNumber(s.clientes)}</div></div>
                <div><div className="text-muted-foreground">Receita histórica</div><div className="mt-0.5 font-medium">{formatBRL(s.receita)}</div></div>
                <div><div className="text-muted-foreground">Gasto médio</div><div className="mt-0.5 font-medium">{formatBRL(s.gastoMedio)}</div></div>
                <div><div className="text-muted-foreground">Recência mediana</div><div className="mt-0.5 font-medium">{s.recenciaMediana} dias</div></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Valor × recência</CardTitle>
          <CardDescription>Priorize clientes de maior valor que estão em risco ou inativos</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segmento</TableHead>
                <TableHead className="text-right">Ativos</TableHead>
                <TableHead className="text-right">Em risco</TableHead>
                <TableHead className="text-right">Inativos</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {valueRecencyMatrix.map((row) => (
                <TableRow key={row.segmento}>
                  <TableCell className="font-medium">{row.segmento}</TableCell>
                  <TableCell className="text-right tabular-nums text-success">{formatNumber(row.ativo)}</TableCell>
                  <TableCell className="text-right tabular-nums text-warning">{formatNumber(row.risco)}</TableCell>
                  <TableCell className="text-right tabular-nums text-destructive">{formatNumber(row.inativo)}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">{formatNumber(row.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 rounded-md bg-warning/10 px-3 py-2 text-sm text-warning">
            Prioridade de retenção: 471 clientes Ouro em risco e 213 clientes Ouro inativos.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo dos segmentos de valor</CardTitle>
          <CardDescription>Faixas calculadas sobre os últimos 12 meses</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {valueSegments.map((s) => (
            <div key={s.id} className="rounded-lg border border-border bg-card/70 p-4">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: s.cor }} /><h3 className="font-semibold">{s.nome}</h3></div>
              <p className="mt-2 text-sm text-muted-foreground">{s.regra}</p>
              <div className="mt-4 text-2xl font-semibold">{formatNumber(s.clientes)}</div>
              <div className="text-xs text-muted-foreground">clientes · {s.receitaPct}% da receita</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
