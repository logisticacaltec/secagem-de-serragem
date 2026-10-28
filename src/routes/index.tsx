import { createFileRoute } from "@tanstack/react-router";
import { PowerBiDashboard } from "@/components/powerbi/PowerBiDashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard Serragem 2026 | Logística Caltec" },
      {
        name: "description",
        content:
          "Dashboard gerencial semanal de acompanhamento de Serragem Secador, Serragem Seca e Estoque & Previsão da Logística Caltec.",
      },
      {
        property: "og:title",
        content: "Dashboard Serragem 2026 | Logística Caltec",
      },
      {
        property: "og:description",
        content: "Dashboard de serragem seca, secador industrial e previsão de estoque semanal.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return <PowerBiDashboard />;
}
