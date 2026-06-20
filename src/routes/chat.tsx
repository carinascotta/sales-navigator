import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout do segmento /chat. As rotas filhas (/chat index e /chat/$threadId)
// são renderizadas pelo <Outlet/>.
export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Assistente IA — VendaSmart" },
      { name: "description", content: "Converse com o assistente IA sobre vendas, clientes e produtos." },
    ],
  }),
  component: () => <Outlet />,
});
