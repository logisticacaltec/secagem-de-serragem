import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  UserCheck,
  Search,
  ArrowLeft,
  KeyRound,
  Trash2,
  Edit2,
  Lock,
  Mail,
  User,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { StoredUser, UserRole } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface AdminUsersViewProps {
  onBackToDashboard: () => void;
}

export function AdminUsersView({ onBackToDashboard }: AdminUsersViewProps) {
  const {
    currentUser,
    users,
    addUser,
    updateUser,
    deleteUser,
    resetPassword,
    toggleUserStatus,
    logout,
  } = useAuth();

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Dialogs
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<StoredUser | null>(null);
  const [passwordResetUser, setPasswordResetUser] = useState<StoredUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<StoredUser | null>(null);

  // Form states for New User
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("usuario");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form states for Edit User
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("usuario");
  const [editActive, setEditActive] = useState(true);

  // Form state for Reset Password
  const [resetPassValue, setResetPassValue] = useState("");
  const [showResetPass, setShowResetPass] = useState(false);

  // Stats
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const regularCount = users.filter((u) => u.role === "usuario").length;
  const activeCount = users.filter((u) => u.active).length;

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && u.active) ||
      (statusFilter === "inactive" && !u.active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle Add User Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addUser({
      name: newName,
      email: newEmail,
      password: newPassword,
      role: newRole,
      active: true,
    });

    if (res.success) {
      toast.success("Usuário pré-cadastrado com sucesso!", {
        description: `${newEmail} já pode efetuar login no sistema.`,
      });
      setIsAddOpen(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("usuario");
    } else {
      toast.error(res.error || "Erro ao cadastrar usuário.");
    }
  };

  // Open Edit User Dialog
  const handleOpenEdit = (user: StoredUser) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditActive(user.active);
  };

  // Handle Edit User Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const res = updateUser(editingUser.id, {
      name: editName,
      email: editEmail,
      role: editRole,
      active: editActive,
    });

    if (res.success) {
      toast.success("Dados do usuário atualizados!");
      setEditingUser(null);
    } else {
      toast.error(res.error || "Erro ao atualizar dados.");
    }
  };

  // Handle Reset Password Submit
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordResetUser) return;

    const res = resetPassword(passwordResetUser.id, resetPassValue);
    if (res.success) {
      toast.success(`Senha redefinida para ${passwordResetUser.name}!`);
      setPasswordResetUser(null);
      setResetPassValue("");
    } else {
      toast.error(res.error || "Erro ao redefinir senha.");
    }
  };

  // Handle Delete User Submit
  const handleDeleteConfirm = () => {
    if (!deletingUser) return;
    const res = deleteUser(deletingUser.id);
    if (res.success) {
      toast.success("Usuário removido do sistema!");
      setDeletingUser(null);
    } else {
      toast.error(res.error || "Erro ao excluir usuário.");
    }
  };

  // Handle Toggle Status
  const handleToggleStatus = (user: StoredUser) => {
    const res = toggleUserStatus(user.id);
    if (res.success) {
      toast.info(
        user.active
          ? `Usuário ${user.name} desativado.`
          : `Usuário ${user.name} reativado.`
      );
    } else {
      toast.error(res.error || "Não foi possível alterar o status.");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030712] text-white p-3 sm:p-6 lg:p-8">
      {/* Background glow effects */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-96 w-96 rounded-full bg-[#1b91ff]/10 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1400px] flex flex-col gap-6">
        {/* Top Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-white/10 bg-[#070e1b]/95 p-4 sm:p-5 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-bold text-zinc-200 hover:text-white transition cursor-pointer border border-white/10"
              title="Voltar ao Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar ao Dashboard</span>
            </button>

            <div className="h-6 w-[1.5px] bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1b91ff] to-cyan-400 text-white shadow-lg shadow-[#1b91ff]/20">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Painel do Administrador</span>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    Gestão de Acessos
                  </span>
                </h1>
                <p className="text-xs text-zinc-400">
                  Pré-cadastro e controle de login de usuários autorizados
                </p>
              </div>
            </div>
          </div>

          {/* Current Admin details & actions */}
          <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-white/10 pt-3 sm:border-0 sm:pt-0">
            <div className="flex items-center gap-2.5 text-right">
              <div className="h-8 w-8 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-xs font-bold text-emerald-300">
                {currentUser?.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-white">{currentUser?.name}</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {currentUser?.email}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sair do sistema"
              className="flex items-center gap-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 px-3 py-2 text-xs font-bold text-red-200 transition cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-[#070e1b]/90 p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span>Total de Usuários</span>
              <Users className="h-4 w-4 text-[#38bdf8]" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-white">{totalUsers}</div>
            <span className="text-[10px] text-zinc-500">Cadastrados no sistema</span>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#070e1b]/90 p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span>Administradores</span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-emerald-400">{adminCount}</div>
            <span className="text-[10px] text-zinc-500">Acesso administrativo total</span>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#070e1b]/90 p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span>Usuários Comuns</span>
              <UserCheck className="h-4 w-4 text-[#1b91ff]" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-[#38bdf8]">{regularCount}</div>
            <span className="text-[10px] text-zinc-500">Acesso a relatórios e dados</span>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#070e1b]/90 p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span>Usuários Ativos</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-white">{activeCount}</div>
            <span className="text-[10px] text-emerald-400/80">Liberados para acesso</span>
          </div>
        </div>

        {/* Toolbar: Search, Filters & "Novo Usuário" */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-white/10 bg-[#070e1b]/90 p-3 sm:p-4 backdrop-blur-md shadow-xl">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou e-mail..."
                className="w-full rounded-xl border border-white/15 bg-white/5 py-2 pl-10 pr-3 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-[#1b91ff] focus:bg-white/10"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-white/15 bg-[#0b1320] px-3 py-2 text-xs text-white outline-none cursor-pointer"
            >
              <option value="all">Todos os Perfis</option>
              <option value="admin">Administradores</option>
              <option value="usuario">Usuários Comuns</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-white/15 bg-[#0b1320] px-3 py-2 text-xs text-white outline-none cursor-pointer"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Somente Ativos</option>
              <option value="inactive">Somente Inativos</option>
            </select>
          </div>

          {/* Button: Pré-cadastrar Novo Usuário */}
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2.5 text-xs font-bold transition shadow-lg shadow-emerald-950/40 border border-emerald-400/30 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>Pré-cadastrar Novo Usuário</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#070e1b]/95 shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/5 uppercase text-[10px] tracking-wider text-zinc-400 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Usuário</th>
                  <th className="py-3.5 px-4">E-mail (Login)</th>
                  <th className="py-3.5 px-4">Perfil</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Data Cadastro</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-500">
                      Nenhum usuário encontrado com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelf = currentUser?.id === u.id;
                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-white/[0.03] transition-colors duration-150"
                      >
                        {/* Name & Avatar */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs uppercase ${
                                u.role === "admin"
                                  ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                                  : "bg-[#1b91ff]/30 text-[#38bdf8] border border-[#1b91ff]/40"
                              }`}
                            >
                              {u.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-white flex items-center gap-1.5">
                                {u.name}
                                {isSelf && (
                                  <span className="rounded bg-white/10 px-1.5 py-0.2 text-[9px] text-zinc-300 font-normal">
                                    (Você)
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-3 px-4 font-mono text-zinc-300">
                          {u.email}
                        </td>

                        {/* Role Badge */}
                        <td className="py-3 px-4">
                          {u.role === "admin" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                              <ShieldCheck className="h-3 w-3" />
                              Administrador
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-950/60 border border-blue-500/40 px-2.5 py-0.5 text-[10px] font-bold text-blue-300">
                              <UserCheck className="h-3 w-3" />
                              Usuário Comum
                            </span>
                          )}
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleStatus(u)}
                            disabled={isSelf}
                            title={
                              isSelf
                                ? "Você não pode desativar seu próprio usuário"
                                : u.active
                                  ? "Clique para desativar"
                                  : "Clique para ativar"
                            }
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                              u.active
                                ? "bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/50"
                                : "bg-red-950/50 text-red-400 border border-red-500/30 hover:bg-red-900/50"
                            }`}
                          >
                            {u.active ? (
                              <>
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                <span>Ativo</span>
                              </>
                            ) : (
                              <>
                                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                <span>Inativo</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Created At */}
                        <td className="py-3 px-4 text-zinc-400 text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEdit(u)}
                              title="Editar dados"
                              className="rounded-lg bg-white/5 hover:bg-white/15 p-1.5 text-zinc-300 hover:text-white transition border border-white/10 cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>

                            {/* Reset Password Button */}
                            <button
                              onClick={() => {
                                setPasswordResetUser(u);
                                setResetPassValue("");
                              }}
                              title="Redefinir senha"
                              className="rounded-lg bg-white/5 hover:bg-amber-500/20 p-1.5 text-zinc-300 hover:text-amber-300 transition border border-white/10 hover:border-amber-500/30 cursor-pointer"
                            >
                              <KeyRound className="h-3.5 w-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => setDeletingUser(u)}
                              disabled={isSelf}
                              title={
                                isSelf
                                  ? "Você não pode excluir sua própria conta"
                                  : "Excluir usuário"
                              }
                              className="rounded-lg bg-white/5 hover:bg-red-500/20 p-1.5 text-zinc-300 hover:text-red-400 transition border border-white/10 hover:border-red-500/30 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= MODAL: PRÉ-CADASTRAR NOVO USUÁRIO ================= */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="border border-white/15 bg-[#0b1320] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
              <UserPlus className="h-5 w-5 text-emerald-400" />
              <span>Pré-cadastrar Novo Usuário</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              O colaborador terá acesso ao sistema utilizando este e-mail e senha.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="flex flex-col gap-3.5 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">Nome Completo</label>
              <div className="relative flex items-center">
                <User className="absolute left-3 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                E-mail Institucional (Login de Acesso)
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 h-4 w-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="joao.silva@caltec.com.br"
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">Senha Provisória/Inicial</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 h-4 w-4 text-zinc-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2 pl-9 pr-10 text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 text-zinc-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">Tipo de Acesso (Perfil)</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-white/15 bg-[#070e1b] py-2 px-3 text-xs text-white outline-none cursor-pointer focus:border-emerald-500"
              >
                <option value="usuario">👤 Usuário Comum (Visualiza Relatórios e Dashboards)</option>
                <option value="admin">👑 Administrador (Acesso total e Gerenciamento de Usuários)</option>
              </select>
            </div>

            <DialogFooter className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-bold text-zinc-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 cursor-pointer"
              >
                Salvar Pré-cadastro
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: EDITAR USUÁRIO ================= */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="border border-white/15 bg-[#0b1320] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
              <Edit2 className="h-5 w-5 text-[#38bdf8]" />
              <span>Editar Usuário</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="flex flex-col gap-3.5 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">Nome</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 py-2 px-3 text-xs text-white outline-none focus:border-[#1b91ff]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">E-mail (Login)</label>
              <input
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 py-2 px-3 text-xs text-white outline-none focus:border-[#1b91ff]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">Perfil de Acesso</label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-white/15 bg-[#070e1b] py-2 px-3 text-xs text-white outline-none cursor-pointer focus:border-[#1b91ff]"
              >
                <option value="usuario">Usuário Comum</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="editActiveCheckbox"
                checked={editActive}
                onChange={(e) => setEditActive(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
              />
              <label htmlFor="editActiveCheckbox" className="text-xs text-zinc-200 cursor-pointer">
                Usuário ativo e liberado para login
              </label>
            </div>

            <DialogFooter className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-bold text-zinc-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#1b91ff] hover:bg-[#0077ee] px-4 py-2 text-xs font-bold text-white shadow-lg cursor-pointer"
              >
                Salvar Alterações
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: REDEFINIR SENHA ================= */}
      <Dialog
        open={!!passwordResetUser}
        onOpenChange={(open) => !open && setPasswordResetUser(null)}
      >
        <DialogContent className="border border-white/15 bg-[#0b1320] text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
              <KeyRound className="h-5 w-5 text-amber-400" />
              <span>Redefinir Senha</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Definir nova senha para <strong>{passwordResetUser?.name}</strong> (
              {passwordResetUser?.email})
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleResetPasswordSubmit} className="flex flex-col gap-3 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">Nova Senha</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 h-4 w-4 text-zinc-400" />
                <input
                  type={showResetPass ? "text" : "password"}
                  required
                  value={resetPassValue}
                  onChange={(e) => setResetPassValue(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2 pl-9 pr-10 text-xs text-white placeholder-zinc-500 outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowResetPass(!showResetPass)}
                  className="absolute right-3 text-zinc-400 hover:text-white"
                >
                  {showResetPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <DialogFooter className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setPasswordResetUser(null)}
                className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-bold text-zinc-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-xl bg-amber-600 hover:bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-lg cursor-pointer"
              >
                Redefinir Senha
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: CONFIRMAR EXCLUSÃO ================= */}
      <Dialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <DialogContent className="border border-white/15 bg-[#0b1320] text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-red-400">
              <Trash2 className="h-5 w-5" />
              <span>Excluir Usuário?</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Tem certeza que deseja remover o usuário{" "}
              <strong className="text-white">{deletingUser?.name}</strong> (
              <span className="font-mono text-zinc-300">{deletingUser?.email}</span>)?
              Esta ação revogará imediatamente o acesso ao sistema.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setDeletingUser(null)}
              className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-bold text-zinc-300 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-bold text-white shadow-lg cursor-pointer"
            >
              Confirmar Exclusão
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
