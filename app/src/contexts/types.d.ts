type Role = "owner" | "admin" | "member";

type User = {
  id: string;
  email: string;
  name?: string | null;
};

type Tenant = {
  id: string;
  name: string;
  url: string;
  role: Role;
};

type TenantInvite = {
  id: string;
  tenant_id: string;
  tenant_name: string;
  role: Exclude<Role, "owner">;
  created_at: string;
};

type AuthContextType = {
  // Estado
  user: User | null;
  tenants: Tenant[];
  invites: TenantInvite[];
  selectedTenant: Tenant | null;
  loading: boolean;

  // Ações
  register: (payload: RegisterPayload) => Promise<void>;

  login: (email: string, password: string) => Promise<void>;

  logout: () => Promise<void>;

  // UI-only
  setSelectedTenant: (tenant: Tenant | null) => void;
};
