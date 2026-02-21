-- ============================
-- EXTENSIONS
-- ============================

-- Necessário para gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================
-- USERS
-- ============================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  password_hash TEXT,
  plan_status TEXT DEFAULT 'inactive',
  current_plan TEXT DEFAULT 'free',
  expiration_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================
-- TENANTS
-- ============================

CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================
-- TENANT MEMBERS (N:N)
-- ============================

CREATE TABLE tenant_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (tenant_id, user_id)
);

-- Índices importantes
CREATE INDEX idx_tenant_members_user_id ON tenant_members(user_id);
CREATE INDEX idx_tenant_members_tenant_id ON tenant_members(tenant_id);

-- ============================
-- TENANT INVITES
-- ============================

CREATE TABLE tenant_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  token TEXT NOT NULL UNIQUE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (tenant_id, email)
);

-- Índices importantes
CREATE INDEX idx_tenant_invites_email ON tenant_invites(email);
CREATE INDEX idx_tenant_invites_tenant_id ON tenant_invites(tenant_id);

-- ============================
-- COMMENTS (documentação)
-- ============================

COMMENT ON TABLE users IS 'Global users. One account per email.';
COMMENT ON TABLE tenants IS 'Organizations / workspaces.';
COMMENT ON TABLE tenant_members IS 'User membership and role per tenant.';
COMMENT ON TABLE tenant_invites IS 'Pending invitations to tenants.';

-- =========================
-- Experiments
-- =========================

CREATE TABLE experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  tenant_id UUID NOT NULL
    REFERENCES tenants(id)
    ON DELETE CASCADE,

  name TEXT NOT NULL,

  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Data de expiração automática do experimento
  ends_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Um experimento por nome dentro do tenant
  CONSTRAINT experiments_unique_name_per_tenant
    UNIQUE (tenant_id, name)
);

-- Índice para lookup rápido (SDK / Edge)
CREATE INDEX idx_experiments_tenant_name
  ON experiments (tenant_id, name);

-- Índice para filtrar experimentos ativos
CREATE INDEX idx_experiments_active
  ON experiments (tenant_id, is_active, ends_at);

-- Index to optimize RLS policies in experiment_variants
CREATE INDEX idx_experiments_id_tenant
  ON experiments (id, tenant_id);

-- =========================
-- Experiment Variants
-- =========================

CREATE TABLE experiment_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  experiment_id UUID NOT NULL
    REFERENCES experiments(id)
    ON DELETE CASCADE,

  value TEXT NOT NULL,

  percent INTEGER NOT NULL
    CHECK (percent >= 0 AND percent <= 100),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Não permitir variantes duplicadas
  CONSTRAINT variants_unique_per_experiment
    UNIQUE (experiment_id, value)
);

-- Index to search variants quickly
CREATE INDEX idx_variants_experiment
  ON experiment_variants (experiment_id);

-- ============================
-- ROW LEVEL SECURITY (RLS)
-- ============================

-- =========================
-- Helper Functions
-- =========================

-- Function to set the current tenant context
CREATE OR REPLACE FUNCTION set_current_tenant(tenant_id UUID)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', tenant_id::TEXT, true);
END;
$$ LANGUAGE plpgsql;

-- Function to get the current tenant context
CREATE OR REPLACE FUNCTION get_current_tenant()
RETURNS UUID AS $$
DECLARE
  tenant_id_str TEXT;
BEGIN
  tenant_id_str := current_setting('app.current_tenant_id', true);
  IF tenant_id_str IS NULL OR tenant_id_str = '' THEN
    RETURN NULL;
  END IF;
  RETURN tenant_id_str::UUID;
EXCEPTION
  WHEN invalid_parameter_value THEN
    RETURN NULL;
  WHEN invalid_text_representation THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION set_current_tenant(UUID) IS 'Sets the current tenant context for RLS policies (transaction-local)';
COMMENT ON FUNCTION get_current_tenant() IS 'Gets the current tenant context (returns NULL if not set)';

-- =========================
-- Enable RLS
-- =========================

ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_variants ENABLE ROW LEVEL SECURITY;

-- =========================
-- RLS Policies
-- =========================

-- Tenant Members Policies
CREATE POLICY tenant_members_isolation_policy ON tenant_members
  FOR ALL
  USING (tenant_id = get_current_tenant())
  WITH CHECK (tenant_id = get_current_tenant());

-- Tenant Invites Policies
CREATE POLICY tenant_invites_isolation_policy ON tenant_invites
  FOR ALL
  USING (tenant_id = get_current_tenant())
  WITH CHECK (tenant_id = get_current_tenant());

-- Experiments Policies
CREATE POLICY experiments_isolation_policy ON experiments
  FOR ALL
  USING (tenant_id = get_current_tenant())
  WITH CHECK (tenant_id = get_current_tenant());

-- Experiment Variants Policies
-- Uses a subquery to check the parent experiment's tenant_id
CREATE POLICY experiment_variants_isolation_policy ON experiment_variants
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM experiments
      WHERE experiments.id = experiment_variants.experiment_id
        AND experiments.tenant_id = get_current_tenant()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM experiments
      WHERE experiments.id = experiment_variants.experiment_id
        AND experiments.tenant_id = get_current_tenant()
    )
  );

-- =========================
-- Comments
-- =========================

COMMENT ON POLICY tenant_members_isolation_policy ON tenant_members IS 'Ensures users can only access tenant_members for their current tenant';
COMMENT ON POLICY tenant_invites_isolation_policy ON tenant_invites IS 'Ensures users can only access tenant_invites for their current tenant';
COMMENT ON POLICY experiments_isolation_policy ON experiments IS 'Ensures users can only access experiments for their current tenant';
COMMENT ON POLICY experiment_variants_isolation_policy ON experiment_variants IS 'Ensures users can only access experiment_variants through their parent experiment tenant';
