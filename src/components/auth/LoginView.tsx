import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, KeyRound, CheckCircle2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import bgSecador from "@/assets/powerbi/Serragem_secador05980170169090138.png";

export function LoginView() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modo Esqueci a senha
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg("Informe o seu e-mail corporativo.");
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

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      return;
    }

    setIsSendingReset(true);
    setTimeout(() => {
      setIsSendingReset(false);
      setForgotSuccess(true);
    }, 600);
  };

  const handleBackToLogin = () => {
    setIsForgotMode(false);
    setForgotSuccess(false);
    setForgotEmail("");
    setErrorMsg(null);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#030712] text-white p-4 overflow-hidden selection:bg-[#1b91ff]/30">
      {/* Background backdrop */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 scale-105 filter blur-[1px]"
        style={{ backgroundImage: `url(${bgSecador})` }}
      />
      {/* Dark gradient overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#030712]/95 via-[#070e1c]/90 to-[#030712]/98" />

      {/* Decorative lighting blobs */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-96 w-96 rounded-full bg-[#1b91ff]/15 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md animate-fadeIn">
        {/* Header: Apenas o título da página */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-serif drop-shadow-md">
            Serragem Seca & Secador
          </h1>
          <p className="mt-2 text-xs text-zinc-400">
            Acesso restrito a colaboradores autorizados
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#070e1b]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* MODO ESQUECI A SENHA */}
          {isForgotMode ? (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1b91ff]/20 text-[#38bdf8]">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Redefinição de Senha</h3>
                  <p className="text-[11px] text-zinc-400">Solicite uma nova senha de acesso</p>
                </div>
              </div>

              {forgotSuccess ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center space-y-3">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                  <p className="text-sm font-semibold text-white">
                    Solicitação enviada com sucesso!
                  </p>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    O administrador responsável foi notificado com o pedido de redefinição para o e-mail:
                    <br />
                    <span className="font-mono text-emerald-300 font-bold">{forgotEmail}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1b91ff] to-[#0066cc] h-10 text-xs font-bold text-white shadow-md hover:brightness-110 transition cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Voltar para o Login</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Informe seu e-mail corporativo cadastrado para solicitar a redefinição de acesso ao administrador do sistema.
                  </p>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-300">
                      E-mail Corporativo
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <input
                        type="email"
                        required
                        autoFocus
                        placeholder="usuario@empresa.com.br"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#1b91ff] focus:bg-white/10 focus:ring-1 focus:ring-[#1b91ff]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={isSendingReset}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1b91ff] to-[#0066cc] py-3 px-4 font-bold text-white shadow-lg shadow-[#1b91ff]/25 transition hover:brightness-110 disabled:opacity-50 cursor-pointer text-sm"
                    >
                      {isSendingReset ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>Enviar Solicitação de Senha</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="w-full flex items-center justify-center gap-1.5 h-9 text-xs font-medium text-zinc-400 hover:text-white transition cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Voltar para o Login</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* MODO NORMAL DE LOGIN */
            <>
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
                    E-mail Corporativo
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@empresa.com.br"
                      autoComplete="email"
                      autoFocus
                      required
                      className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#1b91ff] focus:bg-white/10 focus:ring-1 focus:ring-[#1b91ff]"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-300">Senha</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotMode(true);
                        setForgotEmail(email);
                      }}
                      className="text-xs text-[#38bdf8] hover:text-[#7dd3fc] transition hover:underline cursor-pointer"
                    >
                      Esqueci a senha
                    </button>
                  </div>
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
                      className="absolute right-3 text-zinc-400 hover:text-white transition p-1 cursor-pointer"
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
            </>
          )}
        </div>

        {/* Rodapé limpo e neutro */}
        <p className="mt-4 text-center text-xs text-zinc-500">
          Autenticação Segura • Controle de Acesso
        </p>
      </div>
    </div>
  );
}
