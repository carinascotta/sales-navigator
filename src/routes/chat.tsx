import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Assistente IA — VendaSmart" },
      { name: "description", content: "Converse com o assistente IA sobre vendas, clientes e produtos." },
    ],
  }),
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  useEffect(() => {
    // Pega a conversa mais recente ou cria uma nova
    const raw = typeof window !== "undefined" ? localStorage.getItem("vs-chat-threads") : null;
    let threadId: string | null = null;
    if (raw) {
      try {
        const arr = JSON.parse(raw) as { id: string; updatedAt: number }[];
        if (arr.length) {
          arr.sort((a, b) => b.updatedAt - a.updatedAt);
          threadId = arr[0].id;
        }
      } catch {}
    }
    if (!threadId) {
      threadId = crypto.randomUUID();
      const seed = [{ id: threadId, title: "Nova conversa", updatedAt: Date.now(), messages: [] }];
      localStorage.setItem("vs-chat-threads", JSON.stringify(seed));
    }
    navigate({ to: "/chat/$threadId", params: { threadId }, replace: true });
  }, [navigate]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center text-sm text-muted-foreground">
      Carregando assistente...
    </div>
  );
}
