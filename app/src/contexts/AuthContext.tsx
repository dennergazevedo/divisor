"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
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
  token: string | null;
  loading: boolean;

  register: (
    payload: Parameters<typeof authService.register>[0],
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  selectTenant: (tenantId: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔁 restaurar sessão
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🆕 Cadastro
  async function register(payload: Parameters<typeof authService.register>[0]) {
    setLoading(true);
    try {
      const { user, token } = await authService.register(payload);

      setUser({ email: user.email });
      setToken(token);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ email: user.email }));
    } finally {
      setLoading(false);
    }
  }

  // 🔑 Login (email + senha)
  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const { user, tenants } = await authService.login({
        email,
        password,
      });

      setUser(user);
      setTenants(tenants);

      localStorage.setItem("user", JSON.stringify(user));
    } finally {
      setLoading(false);
    }
  }

  // 🏢 Seleção de tenant
  async function selectTenant(tenantId: string) {
    if (!user) return;

    setLoading(true);
    try {
      const { token } = await authService.selectTenant(user.email, tenantId);

      setToken(token);
      localStorage.setItem("token", token);
    } finally {
      setLoading(false);
    }
  }

  // 🚪 Logout
  function logout() {
    setUser(null);
    setTenants([]);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        tenants,
        token,
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
