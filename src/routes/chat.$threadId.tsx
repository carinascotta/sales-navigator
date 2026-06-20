import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Plus, Trash2, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Conversation, ConversationContent, ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import {
  loadThreads, upsertThread, deleteThread, getThread, deriveTitle, type ChatThread,
} from "@/lib/chat-threads";

export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({
    meta: [
      { title: "Assistente IA — VendaSmart" },
      { name: "description", content: "Converse com o assistente IA sobre vendas, clientes e produtos." },
    ],
  }),
  component: ChatThreadPage,
});

const SUGGESTIONS = [
  "Qual regional cresceu mais este trimestre?",
  "Top 3 produtos por receita em setembro",
  "Resuma o segmento VIP e dê 2 ações",
  "Quais clientes estão em risco de churn?",
];

function ChatThreadPage() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(null);

  // Carrega lista + mensagens da thread atual
  useEffect(() => {
    setThreads(loadThreads());
    const t = getThread(threadId);
    if (t) {
      setInitialMessages(t.messages);
    } else {
      // cria nova thread
      const fresh: ChatThread = {
        id: threadId, title: "Nova conversa", updatedAt: Date.now(), messages: [],
      };
      upsertThread(fresh);
      setThreads(loadThreads());
      setInitialMessages([]);
    }
  }, [threadId]);

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);

  if (initialMessages === null) {
    return <div className="p-6 text-sm text-muted-foreground">Carregando...</div>;
  }

  return (
    <ChatShell
      key={threadId}
      threadId={threadId}
      initialMessages={initialMessages}
      transport={transport}
      threads={threads}
      onSelectThread={(id) => navigate({ to: "/chat/$threadId", params: { threadId: id } })}
      onNewThread={() => {
        const id = crypto.randomUUID();
        upsertThread({ id, title: "Nova conversa", updatedAt: Date.now(), messages: [] });
        setThreads(loadThreads());
        navigate({ to: "/chat/$threadId", params: { threadId: id } });
      }}
      onDeleteThread={(id) => {
        deleteThread(id);
        const remaining = loadThreads();
        setThreads(remaining);
        if (id === threadId) {
          if (remaining.length) {
            navigate({ to: "/chat/$threadId", params: { threadId: remaining[0].id } });
          } else {
            const fresh = crypto.randomUUID();
            upsertThread({ id: fresh, title: "Nova conversa", updatedAt: Date.now(), messages: [] });
            navigate({ to: "/chat/$threadId", params: { threadId: fresh } });
          }
        }
      }}
    />
  );
}

function ChatShell({
  threadId, initialMessages, transport, threads, onNewThread, onDeleteThread, onSelectThread,
}: {
  threadId: string;
  initialMessages: UIMessage[];
  transport: DefaultChatTransport<UIMessage>;
  threads: ChatThread[];
  onSelectThread: (id: string) => void;
  onNewThread: () => void;
  onDeleteThread: (id: string) => void;
}) {
  const [input, setInput] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
  });

  // Persiste localmente sempre que mudar
  useEffect(() => {
    if (status === "streaming" || status === "submitted") return;
    upsertThread({
      id: threadId,
      title: deriveTitle(messages),
      updatedAt: Date.now(),
      messages,
    });
  }, [messages, status, threadId]);

  useEffect(() => {
    taRef.current?.focus();
  }, [threadId, status]);

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = (msg: PromptInputMessage, e: FormEvent) => {
    e.preventDefault();
    const text = msg.text?.trim() ?? input.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="grid h-[calc(100vh-3.5rem)] grid-cols-[260px_1fr]">
      {/* Sidebar de threads */}
      <aside className="flex flex-col border-r border-border bg-sidebar">
        <div className="p-3">
          <Button onClick={onNewThread} className="w-full justify-start gap-2" variant="default">
            <Plus className="h-4 w-4" /> Nova conversa
          </Button>
        </div>
        <div className="px-3 pb-2 text-xs uppercase tracking-wide text-muted-foreground">Histórico</div>
        <ScrollArea className="flex-1">
          <div className="space-y-1 px-2 pb-3">
            {threads.length === 0 && (
              <div className="px-2 py-6 text-center text-xs text-muted-foreground">
                Sem conversas ainda
              </div>
            )}
            {threads.map((t) => {
              const active = t.id === threadId;
              return (
                <div
                  key={t.id}
                  className={`group flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors ${
                    active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/60"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (!active) onSelectThread(t.id);
                    }}
                    className="flex flex-1 items-center gap-2 truncate text-left"
                  >
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{t.title}</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Excluir conversa"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteThread(t.id);
                    }}
                    className="opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </aside>

      {/* Chat */}
      <section className="flex min-w-0 flex-col">
        <Conversation className="flex-1">
          <ConversationContent className="mx-auto w-full max-w-3xl">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-6 py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Assistente VendaSmart</h2>
                  <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    Pergunte sobre receita, regionais, produtos ou segmentos de clientes.
                  </p>
                </div>
                <div className="grid w-full max-w-xl gap-2 sm:grid-cols-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => sendMessage({ text: s })}
                      className="rounded-lg border border-border bg-card p-3 text-left text-sm transition-colors hover:border-primary hover:bg-card/80"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => {
              const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              return (
                <Message key={m.id} from={m.role}>
                  <MessageContent>
                    {m.role === "assistant" ? (
                      <MessageResponse>{text}</MessageResponse>
                    ) : (
                      <span className="whitespace-pre-wrap">{text}</span>
                    )}
                  </MessageContent>
                </Message>
              );
            })}

            {status === "submitted" && (
              <Message from="assistant">
                <MessageContent>
                  <Shimmer>Pensando...</Shimmer>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t border-border bg-background/60 p-4 backdrop-blur">
          <div className="mx-auto w-full max-w-3xl">
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputTextarea
                ref={taRef}
                placeholder="Pergunte ao assistente de vendas..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={status} disabled={!input.trim() && !isLoading} />
              </PromptInputFooter>
            </PromptInput>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Respostas geradas por IA com dados fictícios para demonstração.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
