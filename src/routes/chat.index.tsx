import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

// Index de /chat: escolhe a conversa mais recente (ou cria uma) e redireciona
// para /chat/$threadId.
export const Route = createFileRoute("/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  useEffect(() => {
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
