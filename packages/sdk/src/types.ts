export type DivisorConfig = {
  tenantId: string;
  userId?: string;
};

export type ExperimentResult = {
  experiment: string;
  variant: string | null;
};

export type GetVariant = {
  experimentName: string;
  variantFallback?: string;
};

export type ConversionData = {
  experimentName: string;
  variant: string;
  value: number;
  itensCount: number;
};
