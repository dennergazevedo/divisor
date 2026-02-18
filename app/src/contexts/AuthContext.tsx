"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import * as authService from "@/services/auth";

type Tenant = {
  id: string;
  name: string;
  slug: string;
};

type User = {
  email: string;
};

type AuthContextType = {
  user: User | null;
  tenants: Tenant[];
  loading: boolean;

  register: (
    payload: Parameters<typeof authService.register>[0],
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  selectTenant: (tenantId: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);

  // 🆕 Cadastro
  async function register(payload: Parameters<typeof authService.register>[0]) {
    setLoading(true);
    try {
      const { user } = await authService.register(payload);

      setUser({ email: user.email });

      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  // 🔑 Login
  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const { user, tenants } = await authService.login({
        email,
        password,
      });

      setUser(user);
      setTenants(tenants);

      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  // 🏢 Seleção de tenant
  async function selectTenant(tenantId: string) {
    if (!user) return;

    setLoading(true);
    try {
      await authService.selectTenant(user.email, tenantId);

      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  // 🚪 Logout
  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setUser(null);
      setTenants([]);

      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadSession() {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();

        setUser(data.user);
        setTenants(data.tenants);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        tenants,
        loading,
        register,
        login,
        selectTenant,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
