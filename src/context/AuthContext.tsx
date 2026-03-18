"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AuthUser = {
  email: string;
  first_name: string;
  last_name: string;
  table: "customers" | "teams";
  id: number;
  phone?: string;
  days_available?: number;
  sessions_available?: number;
};

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  loginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("auth_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("auth_user");
      }
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/lookup?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        setError("unauthorized");
        return false;
      }
      const data = await res.json();
      if (data.table === "customers" && Number(data.sessions_available) === 0) {
        setError("no_sessions");
        return false;
      }
      const authUser: AuthUser = {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        table: data.table,
        id: data.id,
        phone: data.phone,
        days_available: data.days_available,
        sessions_available: data.sessions_available,
      };
      setUser(authUser);
      localStorage.setItem("auth_user", JSON.stringify(authUser));
      return true;
    } catch {
      setError("error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  const clearError = () => setError(null);
  const openLoginModal = () => { clearError(); setLoginModalOpen(true); };
  const closeLoginModal = () => setLoginModalOpen(false);

  return (
    <AuthContext.Provider value={{ user, login, logout, loginModalOpen, openLoginModal, closeLoginModal, isLoading, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
