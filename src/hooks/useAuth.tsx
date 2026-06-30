"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Address, User } from "@/types";

const AUTH_STORAGE_KEY = "boutique_auth_session";

export type AuthUser = User & {
  firstName?: string;
  lastName?: string;
  email?: string;
  addresses?: Address[];
  defaultAddressId?: string;
};

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: AuthUser) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredSession(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as { user?: AuthUser };
    return parsed.user ?? null;
  } catch {
    return null;
  }
}

function persistSession(user: AuthUser | null) {
  if (typeof window === "undefined") return;

  if (!user) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({ user, updatedAt: new Date().toISOString() })
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const persistUser = useCallback((nextUser: AuthUser | null) => {
    setUser(nextUser);
    persistSession(nextUser);
  }, []);

  const refreshUser = useCallback(async () => {
    const storedUser = readStoredSession();

    if (!storedUser) {
      setUser(null);
      setLoading(false);
      persistSession(null);
      return false;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await response.json();

      if (data.success) {
        const nextUser = { ...storedUser, ...data.data } as AuthUser;
        persistUser(nextUser);
        setLoading(false);
        return true;
      }
    } catch {
      // Ignore and fall back to clearing the stale session.
    }

    persistUser(null);
    setLoading(false);
    return false;
  }, [persistUser]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    (nextUser: AuthUser) => {
      persistUser(nextUser);
      setLoading(false);
    },
    [persistUser]
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network issues during logout and clear client state anyway.
    }

    persistUser(null);
    setLoading(false);
  }, [persistUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      refreshUser,
    }),
    [loading, login, logout, refreshUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
