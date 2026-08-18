"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { User } from "@/lib/schemas/auth";
import * as store from "./store";

interface AuthContextValue {
  user: User | null;
  signUp: (input: { email: string; password: string; pseudonym: string }) => Promise<User>;
  login: (input: { email: string; password: string }) => Promise<User>;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(
    store.subscribeSession,
    store.getSessionSnapshot,
    store.getServerSessionSnapshot,
  );

  const signUp = useCallback((input: { email: string; password: string; pseudonym: string }) => {
    return store.signUp(input);
  }, []);

  const login = useCallback((input: { email: string; password: string }) => {
    return store.login(input);
  }, []);

  const logout = useCallback(() => {
    store.logout();
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<User>) => {
      if (!user) return;
      store.updateProfile(user.id, patch);
    },
    [user],
  );

  const deleteAccount = useCallback(() => {
    if (!user) return;
    store.deleteAccount(user.id);
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, signUp, login, logout, updateProfile, deleteAccount }),
    [user, signUp, login, logout, updateProfile, deleteAccount],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
