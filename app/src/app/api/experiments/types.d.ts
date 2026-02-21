type VariantRow = {
  experiment_id: string;
  value: string;
  percent: number;
};

type ExperimentRow = {
  id: string;
  name: string;
  is_active: boolean;
  ends_at: string | null;
  plan_status: string;
  current_plan: string;
  expiration_date: string;
  user_id: string;
};
