import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  type AuthUser,
  type StoredUser,
  type UserRole,
  type AuthResult,
  getStoredUsers,
  saveStoredUsers,
  getStoredSession,
  saveStoredSession,
  authenticateUser,
  INITIAL_USERS,
} from "@/lib/auth";

export interface NewUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  active?: boolean;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  users: StoredUser[];
  isAdmin: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  addUser: (data: NewUserData) => { success: boolean; error?: string };
  updateUser: (
    id: string,
    data: Partial<Pick<StoredUser, "name" | "email" | "role" | "active">>
  ) => { success: boolean; error?: string };
  deleteUser: (id: string) => { success: boolean; error?: string };
  resetPassword: (id: string, newPassword: string) => { success: boolean; error?: string };
  toggleUserStatus: (id: string) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<StoredUser[]>(INITIAL_USERS);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar sessão e usuários do localStorage após montagem
  useEffect(() => {
    try {
      const storedUsers = getStoredUsers();
      setUsers(storedUsers);

      const session = getStoredSession();
      if (session) {
        setCurrentUser(session);
      } else if (typeof window !== "undefined") {
        // Se estiver embutido no painel Caltec (iframe ou parâmetro embed)
        const isEmbedded = window.self !== window.top;
        const params = new URLSearchParams(window.location.search);
        const embedParam = params.get("embed") === "true";
        const emailParam = params.get("user") || params.get("email");

        if (isEmbedded || embedParam) {
          const matchingUser = emailParam
            ? storedUsers.find((u) => u.email.toLowerCase() === emailParam.toLowerCase())
            : null;

          const authUser: AuthUser = {
            id: matchingUser?.id || "user-embedded",
            name: matchingUser?.name || "Operador Caltec",
            email: matchingUser?.email || "operacao@caltec.com.br",
            role: matchingUser?.role || "usuario",
            active: true,
            createdAt: new Date().toISOString(),
          };
          setCurrentUser(authUser);
        }
      }
    } catch (err) {
      console.error("Erro na inicialização de autenticação:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const result = authenticateUser(email, password);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      setUsers(getStoredUsers());
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    saveStoredSession(null);
    setCurrentUser(null);
  }, []);

  const addUser = useCallback(
    (data: NewUserData): { success: boolean; error?: string } => {
      if (!currentUser || currentUser.role !== "admin") {
        return { success: false, error: "Apenas administradores podem cadastrar usuários." };
      }

      const cleanName = data.name.trim();
      const cleanEmail = data.email.trim().toLowerCase();
      const cleanPassword = data.password.trim();

      if (!cleanName || !cleanEmail || !cleanPassword) {
        return { success: false, error: "Todos os campos são obrigatórios." };
      }

      // Validar formato de e-mail básico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return { success: false, error: "Formato de e-mail inválido." };
      }

      if (cleanPassword.length < 4) {
        return { success: false, error: "A senha deve ter no mínimo 4 caracteres." };
      }

      const currentUsers = getStoredUsers();
      const alreadyExists = currentUsers.some(
        (u) => u.email.trim().toLowerCase() === cleanEmail
      );

      if (alreadyExists) {
        return { success: false, error: "Já existe um usuário cadastrado com este e-mail." };
      }

      const newUser: StoredUser = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        role: data.role,
        active: data.active ?? true,
        createdAt: new Date().toISOString(),
      };

      const updated = [newUser, ...currentUsers];
      saveStoredUsers(updated);
      setUsers(updated);

      return { success: true };
    },
    [currentUser]
  );

  const updateUser = useCallback(
    (
      id: string,
      data: Partial<Pick<StoredUser, "name" | "email" | "role" | "active">>
    ): { success: boolean; error?: string } => {
      if (!currentUser || currentUser.role !== "admin") {
        return { success: false, error: "Apenas administradores podem alterar usuários." };
      }

      const currentUsers = getStoredUsers();
      const targetIndex = currentUsers.findIndex((u) => u.id === id);
      if (targetIndex === -1) {
        return { success: false, error: "Usuário não encontrado." };
      }

      if (data.email) {
        const cleanEmail = data.email.trim().toLowerCase();
        const conflict = currentUsers.some(
          (u) => u.id !== id && u.email.trim().toLowerCase() === cleanEmail
        );
        if (conflict) {
          return { success: false, error: "Já existe outro usuário utilizando este e-mail." };
        }
        data.email = cleanEmail;
      }

      if (data.name) {
        data.name = data.name.trim();
      }

      const updatedUser = { ...currentUsers[targetIndex], ...data };
      currentUsers[targetIndex] = updatedUser;

      saveStoredUsers(currentUsers);
      setUsers([...currentUsers]);

      // Se alterou o próprio usuário logado, atualiza sessão
      if (currentUser.id === id) {
        const newSessionUser: AuthUser = {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          active: updatedUser.active,
          createdAt: updatedUser.createdAt,
          lastLogin: updatedUser.lastLogin,
        };
        setCurrentUser(newSessionUser);
        saveStoredSession(newSessionUser);
      }

      return { success: true };
    },
    [currentUser]
  );

  const deleteUser = useCallback(
    (id: string): { success: boolean; error?: string } => {
      if (!currentUser || currentUser.role !== "admin") {
        return { success: false, error: "Apenas administradores podem excluir usuários." };
      }

      if (currentUser.id === id) {
        return { success: false, error: "Você não pode excluir a sua própria conta logada." };
      }

      const currentUsers = getStoredUsers();
      const filtered = currentUsers.filter((u) => u.id !== id);

      // Garantir que sempre reste ao menos 1 administrador
      const remainingAdmins = filtered.filter((u) => u.role === "admin" && u.active);
      if (remainingAdmins.length === 0) {
        return {
          success: false,
          error: "O sistema precisa ter pelo menos um administrador ativo.",
        };
      }

      saveStoredUsers(filtered);
      setUsers(filtered);

      return { success: true };
    },
    [currentUser]
  );

  const resetPassword = useCallback(
    (id: string, newPassword: string): { success: boolean; error?: string } => {
      if (!currentUser || currentUser.role !== "admin") {
        return { success: false, error: "Apenas administradores podem redefinir senhas." };
      }

      const cleanPass = newPassword.trim();
      if (!cleanPass || cleanPass.length < 4) {
        return { success: false, error: "A nova senha deve ter no mínimo 4 caracteres." };
      }

      const currentUsers = getStoredUsers();
      const targetIndex = currentUsers.findIndex((u) => u.id === id);
      if (targetIndex === -1) {
        return { success: false, error: "Usuário não encontrado." };
      }

      currentUsers[targetIndex].password = cleanPass;
      saveStoredUsers(currentUsers);
      setUsers([...currentUsers]);

      return { success: true };
    },
    [currentUser]
  );

  const toggleUserStatus = useCallback(
    (id: string): { success: boolean; error?: string } => {
      if (!currentUser || currentUser.role !== "admin") {
        return { success: false, error: "Apenas administradores podem alterar o status." };
      }

      if (currentUser.id === id) {
        return { success: false, error: "Você não pode desativar o seu próprio usuário." };
      }

      const currentUsers = getStoredUsers();
      const targetIndex = currentUsers.findIndex((u) => u.id === id);
      if (targetIndex === -1) {
        return { success: false, error: "Usuário não encontrado." };
      }

      const newStatus = !currentUsers[targetIndex].active;
      currentUsers[targetIndex].active = newStatus;

      saveStoredUsers(currentUsers);
      setUsers([...currentUsers]);

      return { success: true };
    },
    [currentUser]
  );

  const isAdmin = currentUser?.role === "admin";
  const isLoggedIn = !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAdmin,
        isLoggedIn,
        isLoading,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
        resetPassword,
        toggleUserStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
}

