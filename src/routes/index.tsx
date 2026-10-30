import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PowerBiDashboard } from "@/components/powerbi/PowerBiDashboard";
import { LoginView } from "@/components/auth/LoginView";
import { AdminUsersView } from "@/components/auth/AdminUsersView";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard Serragem 2026" },
      {
        name: "description",
        content:
          "Dashboard gerencial semanal de acompanhamento de Serragem Secador, Serragem Seca e Estoque & Previsão.",
      },
      {
        property: "og:title",
        content: "Dashboard Serragem 2026",
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
  const { currentUser, isLoggedIn, isAdmin, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<"dashboard" | "admin">("dashboard");

  // Loading state during SSR / initial localStorage reading
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#030712] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-extrabold tracking-wider text-white">
              Serragem Seca & Secador
            </span>
            <div className="h-6 w-[1.5px] bg-white/20" />
            <span className="text-xs uppercase font-bold tracking-widest text-[#38bdf8]">
              Controle Operacional
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#1b91ff] border-t-transparent" />
            <span>Carregando sistema...</span>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated: Show Login Screen
  if (!isLoggedIn || !currentUser) {
    return <LoginView />;
  }

  // Default: Authenticated viewing Dashboard (cadastro exclusivo na Inteligência Logística)
  return (
    <PowerBiDashboard />
  );
}
