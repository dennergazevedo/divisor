type RegisterPayload = {
  email: string;
  password: string;
  tenant: { id: string } | { name: string; slug: string };
};

type LoginPayload = {
  email: string;
  password: string;
};

export async function register(payload: RegisterPayload) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw await res.json();
  }

  return res.json();
}

export async function login(payload: LoginPayload) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw await res.json();
  }

  return res.json();
}

export async function selectTenant(email: string, tenantId: string) {
  const res = await fetch("/api/auth/select-tenant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, tenantId }),
  });

  if (!res.ok) {
    throw await res.json();
  }

  return res.json();
}
