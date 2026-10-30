import { describe, expect, it, beforeEach } from "vitest";
import {
  authenticateUser,
  getStoredUsers,
  saveStoredUsers,
  INITIAL_USERS,
  AUTH_USERS_STORAGE_KEY,
  AUTH_SESSION_STORAGE_KEY,
  type StoredUser,
} from "@/lib/auth";

describe("Authentication & User Management", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
  });

  it("loads default users when localStorage is empty", () => {
    localStorage.clear();
    const users = getStoredUsers();
    expect(users.length).toBe(2);
    expect(users[0].email).toBe("admin@caltec.com.br");
    expect(users[0].role).toBe("admin");
    expect(users[1].email).toBe("operacao@caltec.com.br");
    expect(users[1].role).toBe("usuario");
  });

  it("authenticates admin with valid credentials", () => {
    const res = authenticateUser("admin@caltec.com.br", "caltec@2026");
    expect(res.success).toBe(true);
    expect(res.user?.email).toBe("admin@caltec.com.br");
    expect(res.user?.role).toBe("admin");
  });

  it("authenticates regular user with case-insensitive email", () => {
    const res = authenticateUser("OPERACAO@caltec.com.br", "serragem@2026");
    expect(res.success).toBe(true);
    expect(res.user?.email).toBe("operacao@caltec.com.br");
    expect(res.user?.role).toBe("usuario");
  });

  it("fails with invalid password", () => {
    const res = authenticateUser("admin@caltec.com.br", "wrongpass");
    expect(res.success).toBe(false);
    expect(res.error).toContain("Senha incorreta");
  });

  it("fails when user is not pre-registered", () => {
    const res = authenticateUser("desconhecido@empresa.com", "123456");
    expect(res.success).toBe(false);
    expect(res.error).toContain("pré-cadastrado");
  });

  it("fails when user is inactive", () => {
    const users = getStoredUsers();
    users[1].active = false;
    saveStoredUsers(users);

    const res = authenticateUser("operacao@caltec.com.br", "serragem@2026");
    expect(res.success).toBe(false);
    expect(res.error).toContain("desativado");
  });
});

