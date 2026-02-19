export type DivisorConfig = {
  tenantId: string;
};

export type ExperimentResult = {
  experiment: string;
  variant: string | null;
};

export type GetVariant = {
  experimentName: string;
  userId?: string;
  variantFallback?: string;
};
