import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import bgSecador from "@/assets/powerbi/Serragem_secador05980170169090138.png";

export function LoginView() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg("Informe o seu e-mail de acesso.");
      return;
    }
    if (!password) {
      setErrorMsg("Informe a sua senha.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || "Falha no acesso. Verifique suas credenciais.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setErrorMsg("Ocorreu um erro ao processar o login. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg(null);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#030712] text-white p-4 overflow-hidden selection:bg-[#1b91ff]/30">
      {/* Background with real Power BI Caltec backdrop */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25 scale-105 filter blur-[1px]"
        style={{ backgroundImage: `url(${bgSecador})` }}
      />
      {/* Dark gradient overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#030712]/95 via-[#070e1c]/90 to-[#030712]/98" />

      {/* Decorative lighting blobs */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-96 w-96 rounded-full bg-[#1b91ff]/15 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md animate-fadeIn">
        <div className="rounded-2xl border border-white/10 bg-[#070e1b]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Header Brand */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex items-center gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold tracking-wider text-white">
                CALTEC
              </span>
              <div className="h-7 w-[2px] bg-white/20" />
              <div className="flex flex-col text-left">
                <span className="text-[11px] uppercase font-bold tracking-widest text-[#38bdf8]">
                  Logística 2026
                </span>
                <span className="text-[9px] text-zinc-400">Controle Operacional</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300 border border-white/10">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Acesso restrito a usuários pré-cadastrados</span>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                E-mail de Acesso (Login)
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@caltec.com.br"
                  autoComplete="email"
                  autoFocus
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#1b91ff] focus:bg-white/10 focus:ring-1 focus:ring-[#1b91ff]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">Senha</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#1b91ff] focus:bg-white/10 focus:ring-1 focus:ring-[#1b91ff]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-zinc-400 hover:text-white transition p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1b91ff] to-[#0066cc] py-3 px-4 font-bold text-white shadow-lg shadow-[#1b91ff]/25 transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50 cursor-pointer text-sm"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Validando credenciais...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick-fill helper for convenience */}
          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2">
              <span className="flex items-center gap-1 text-zinc-300">
                <Sparkles className="h-3 w-3 text-amber-400" />
                Acessos iniciais pré-configurados:
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill("admin@caltec.com.br", "caltec@2026")}
                className="flex flex-col items-start rounded-lg bg-white/5 p-2 text-left border border-white/10 hover:bg-white/10 hover:border-emerald-500/40 transition cursor-pointer"
              >
                <div className="flex items-center gap-1 font-semibold text-emerald-400 text-[11px]">
                  <span>👑 Administrador</span>
                </div>
                <span className="text-[10px] text-zinc-400 truncate w-full">admin@caltec.com.br</span>
                <span className="text-[9px] text-zinc-500 font-mono">Senha: caltec@2026</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("operacao@caltec.com.br", "serragem@2026")}
                className="flex flex-col items-start rounded-lg bg-white/5 p-2 text-left border border-white/10 hover:bg-white/10 hover:border-[#1b91ff]/40 transition cursor-pointer"
              >
                <div className="flex items-center gap-1 font-semibold text-[#38bdf8] text-[11px]">
                  <span>👤 Usuário Operação</span>
                </div>
                <span className="text-[10px] text-zinc-400 truncate w-full">operacao@caltec.com.br</span>
                <span className="text-[9px] text-zinc-500 font-mono">Senha: serragem@2026</span>
              </button>
            </div>
          </div>

          {/* Notice Footer */}
          <p className="mt-4 text-center text-[10px] text-zinc-500">
            Novos colaboradores devem solicitar a liberação do seu e-mail ao administrador responsável.
          </p>
        </div>
      </div>
    </div>
  );
}
