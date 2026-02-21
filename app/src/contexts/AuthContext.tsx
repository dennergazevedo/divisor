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

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [invites, setInvites] = useState<TenantInvite[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  async function register(payload: RegisterPayload) {
    setLoading(true);
    try {
      const { user } = await authService.register(payload);

      setUser(user);
      setTenants([]);
      setSelectedTenant(null);

      const params = new URLSearchParams(window.location.search);
      const plan = params.get("plan");
      const billingCycle = params.get("billingCycle");

      if (plan && plan !== "free" && billingCycle) {
        router.push(`/payment?plan=${plan}&billingCycle=${billingCycle}`);
      } else {
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const { user, tenants } = await authService.login({
        email,
        password,
      });

      setUser(user);
      setTenants(tenants);
      setSelectedTenant(tenants[0] ?? null);

      const params = new URLSearchParams(window.location.search);
      const plan = params.get("plan");
      const billingCycle = params.get("billingCycle");

      if (plan && plan !== "free" && billingCycle) {
        router.push(`/payment?plan=${plan}&billingCycle=${billingCycle}`);
      } else {
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });

      setUser(null);
      setTenants([]);
      setInvites([]);
      setSelectedTenant(null);

      router.push("/auth");
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
          next: { revalidate: 60 },
        });

        if (!res.ok) {
          setUser(null);
          setTenants([]);
          setInvites([]);
          return;
        }

        const data = await res.json();

        setUser(data.user);
        setTenants(data.tenants);
        setInvites(data.invites ?? []);
        setSelectedTenant(data.tenants?.[0] ?? null);
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
        invites,
        selectedTenant,
        setSelectedTenant,
        loading,
        register,
        login,
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
