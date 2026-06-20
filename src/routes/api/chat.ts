import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const SYSTEM_PROMPT = `Você é o assistente de vendas da VendaSmart, uma ferramenta interna usada pelo time de vendas de um varejista.

Você ajuda diretores e vendedores a entender:
- Resultados de vendas (histórico, por produto, por região e por loja)
- Performance dos vendedores e regionais
- Segmentação de clientes (CRM) — receita e valor por segmento
- Catálogo de produtos e recomendações estratégicas

Responda sempre em português do Brasil, de forma objetiva, com tom executivo.
Use markdown (listas, tabelas e negritos) para deixar os insights claros.
Quando o usuário pedir um número específico que você não tem, diga claramente que os dados reais ainda serão conectados e dê uma resposta exemplificativa baseada em dados fictícios plausíveis do varejo brasileiro.`;

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
