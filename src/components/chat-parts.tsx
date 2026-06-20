import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ChartSpec = {
  type: "bar" | "line" | "area" | "pie";
  title: string;
  xKey: string;
  series: { key: string; label: string }[];
  data: Record<string, string | number>[];
};

export type FileSpec = {
  filename: string;
  columns: string[];
  rows: (string | number)[][];
};

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export function ChartPart({ spec }: { spec: ChartSpec }) {
  if (!spec?.data?.length || !spec?.series?.length) return null;

  return (
    <div className="my-2 rounded-lg border border-border bg-card p-4">
      <p className="mb-3 text-sm font-semibold">{spec.title}</p>
      <ResponsiveContainer width="100%" height={260}>
        {spec.type === "pie" ? (
          <PieChart>
            <Tooltip />
            <Pie
              data={spec.data}
              dataKey={spec.series[0].key}
              nameKey={spec.xKey}
              outerRadius={90}
              label
            >
              {spec.data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : spec.type === "line" ? (
          <LineChart data={spec.data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey={spec.xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {spec.series.map((s, i) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        ) : spec.type === "area" ? (
          <AreaChart data={spec.data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey={spec.xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {spec.series.map((s, i) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={COLORS[i % COLORS.length]}
                fill={COLORS[i % COLORS.length]}
                fillOpacity={0.2}
              />
            ))}
          </AreaChart>
        ) : (
          <BarChart data={spec.data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey={spec.xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {spec.series.map((s, i) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={COLORS[i % COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function toCsv(file: FileSpec): string {
  const escape = (v: string | number) => {
    const s = String(v ?? "");
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = file.columns.map(escape).join(",");
  const body = file.rows.map((r) => r.map(escape).join(",")).join("\n");
  return `${header}\n${body}`;
}

export function FilePart({ file }: { file: FileSpec }) {
  const url = useMemo(() => {
    if (!file?.columns?.length || !file?.rows?.length) return null;
    // BOM para abrir acentuação corretamente no Excel.
    const blob = new Blob([`﻿${toCsv(file)}`], {
      type: "text/csv;charset=utf-8",
    });
    return URL.createObjectURL(blob);
  }, [file]);

  if (!url) return null;

  return (
    <div className="my-2 flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
      <div className="flex min-w-0 items-center gap-2">
        <FileSpreadsheet className="h-5 w-5 shrink-0 text-primary" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{file.filename}</p>
          <p className="text-xs text-muted-foreground">
            {file.rows.length} linhas · {file.columns.length} colunas
          </p>
        </div>
      </div>
      <Button asChild size="sm" variant="default">
        <a href={url} download={file.filename}>
          <Download className="mr-1 h-4 w-4" /> Baixar
        </a>
      </Button>
    </div>
  );
}
