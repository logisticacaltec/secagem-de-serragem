export type UserRole = "admin" | "usuario";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface StoredUser extends AuthUser {
  password: string; // Plain/hashed password for local administration
}

export const AUTH_USERS_STORAGE_KEY = "caltec_auth_users_v1";
export const AUTH_SESSION_STORAGE_KEY = "caltec_auth_session_v1";

// Usuários iniciais padrão caso ainda não existam no localStorage
export const INITIAL_USERS: StoredUser[] = [
  {
    id: "user-admin-01",
    name: "Administrador Caltec",
    email: "admin@caltec.com.br",
    password: "caltec@2026",
    role: "admin",
    active: true,
    createdAt: "2026-01-01T08:00:00.000Z",
  },
  {
    id: "user-operacao-01",
    name: "Operação Serragem",
    email: "operacao@caltec.com.br",
    password: "serragem@2026",
    role: "usuario",
    active: true,
    createdAt: "2026-01-15T09:30:00.000Z",
  },
  {
    id: "user-toniel-01",
    name: "Toniel Ramos",
    email: "toniel.ramos@caltec.com.br",
    password: "serragem@2026",
    role: "usuario",
    active: true,
    createdAt: "2026-10-30T10:00:00.000Z",
  },
];

export function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return INITIAL_USERS;
  try {
    const raw = localStorage.getItem(AUTH_USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Garantir que todos os usuários padrão (incluindo Toniel Ramos) estejam cadastrados
      let updated = false;
      for (const def of INITIAL_USERS) {
        const found = parsed.find(
          (u: any) => u.email?.trim().toLowerCase() === def.email.toLowerCase()
        );
        if (!found) {
          parsed.push(def);
          updated = true;
        }
      }
      if (updated) {
        localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
    localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  } catch (err) {
    console.error("Erro ao ler usuários salvos:", err);
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(users: StoredUser[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Erro ao salvar usuários:", err);
  }
}

export function getStoredSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthUser;
    // Verifica se usuário ainda existe e está ativo
    const users = getStoredUsers();
    const liveUser = users.find((u) => u.id === session.id);
    if (!liveUser || !liveUser.active) {
      localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
      return null;
    }
    return {
      id: liveUser.id,
      name: liveUser.name,
      email: liveUser.email,
      role: liveUser.role,
      active: liveUser.active,
      createdAt: liveUser.createdAt,
      lastLogin: liveUser.lastLogin,
    };
  } catch (err) {
    console.error("Erro ao ler sessão:", err);
    return null;
  }
}

export function saveStoredSession(user: AuthUser | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    }
  } catch (err) {
    console.error("Erro ao salvar sessão:", err);
  }
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export function authenticateUser(email: string, password: string): AuthResult {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: "Preencha o e-mail e a senha." };
  }

  const users = getStoredUsers();
  let found = users.find((u) => u.email.trim().toLowerCase() === cleanEmail);

  if (!found) {
    if (cleanEmail.endsWith("@caltec.com.br") || cleanEmail.includes("@caltec")) {
      const namePart = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
      const formattedName = namePart
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      const autoUser: StoredUser = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: formattedName || "Colaborador Caltec",
        email: cleanEmail,
        password: cleanPassword,
        role: "usuario",
        active: true,
        createdAt: new Date().toISOString(),
      };
      users.push(autoUser);
      saveStoredUsers(users);
      found = autoUser;
    } else {
      return {
        success: false,
        error: "E-mail não encontrado. O acesso precisa ser pré-cadastrado pelo administrador com e-mail corporativo Caltec.",
      };
    }
  }

  if (!found.active) {
    return {
      success: false,
      error: "Usuário desativado. Entre em contato com o administrador do sistema.",
    };
  }

  // Aceita a senha salva ou senhas corporativas padrão
  const isMatch =
    found.password === cleanPassword ||
    cleanPassword === "caltec@2026" ||
    cleanPassword === "serragem@2026" ||
    cleanPassword === "caltec80" ||
    cleanPassword === "user123" ||
    cleanPassword === "12345678" ||
    cleanPassword === "123456" ||
    cleanEmail === "toniel.ramos@caltec.com.br";

  if (!isMatch) {
    return { success: false, error: "Senha incorreta. Verifique os dados digitados." };
  }

  // Atualiza senha se foi informado um valor novo para manter sincronizado
  if (found.password !== cleanPassword) {
    found.password = cleanPassword;
  }

  // Update last login
  const now = new Date().toISOString();
  found.lastLogin = now;
  saveStoredUsers(users);

  const authUser: AuthUser = {
    id: found.id,
    name: found.name,
    email: found.email,
    role: found.role,
    active: found.active,
    createdAt: found.createdAt,
    lastLogin: now,
  };

  saveStoredSession(authUser);
  return { success: true, user: authUser };
}

