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

-- Índice para buscar variantes rápido
CREATE INDEX idx_variants_experiment
  ON experiment_variants (experiment_id);
