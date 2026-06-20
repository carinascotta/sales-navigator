import { createFileRoute } from "@tanstack/react-router";
import { createAnthropic } from "@ai-sdk/anthropic";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { buildAgentSystemPrompt } from "@/lib/agent-context";

type ChatRequestBody = { messages?: unknown };

// Ferramenta: renderiza um gráfico no chat. Não há side effect — o execute
// apenas valida/ecoa o spec, que o frontend desenha com recharts.
const renderChart = tool({
  description:
    "Renderiza um gráfico para o usuário a partir dos dados de vendas/CRM do projeto. Use para comparações entre regionais, evolução mensal de receita, mix de segmentos, etc. Calcule os pontos de dados a partir do contexto antes de chamar.",
  inputSchema: z.object({
    type: z.enum(["bar", "line", "area", "pie"]).describe("Tipo de gráfico"),
    title: z.string().describe("Título do gráfico"),
    xKey: z
      .string()
      .describe("Nome da chave do eixo X / categoria presente em cada ponto de dados"),
    series: z
      .array(
        z.object({
          key: z.string().describe("Nome da chave numérica em cada ponto de dados"),
          label: z.string().describe("Rótulo legível da série"),
        }),
      )
      .min(1)
      .describe("Séries numéricas a plotar (1+)"),
    data: z
      .array(z.record(z.string(), z.union([z.string(), z.number()])))
      .min(1)
      .describe("Pontos de dados; cada objeto contém xKey e as chaves das séries"),
  }),
  execute: async (input) => input,
});

// Ferramenta: disponibiliza um CSV para download com os dados solicitados.
const generateFile = tool({
  description:
    "Disponibiliza um arquivo CSV para download com os dados solicitados pelo usuário. Use quando pedirem para exportar/baixar dados. Preencha columns e rows a partir do contexto.",
  inputSchema: z.object({
    filename: z
      .string()
      .describe("Nome do arquivo com extensão .csv, ex.: receita_por_regional.csv"),
    columns: z.array(z.string()).min(1).describe("Cabeçalhos das colunas, em ordem"),
    rows: z
      .array(z.array(z.union([z.string(), z.number()])))
      .min(1)
      .describe("Linhas de dados; cada linha alinha posicionalmente com columns"),
  }),
  execute: async (input) => input,
});

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
          return new Response("Missing ANTHROPIC_API_KEY", { status: 500 });
        }

        const anthropic = createAnthropic({ apiKey });

        const result = streamText({
          model: anthropic("claude-opus-4-8"),
          system: buildAgentSystemPrompt(),
          messages: await convertToModelMessages(messages as UIMessage[]),
          tools: { renderChart, generateFile },
          // Permite o ciclo: chamar ferramenta -> receber resultado -> escrever texto.
          stopWhen: stepCountIs(5),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
