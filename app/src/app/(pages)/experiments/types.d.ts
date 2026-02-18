type Variant = {
  value: string;
  percent: number;
};

type Experiment = {
  id: string;
  name: string;
  is_active: boolean;
  ends_at: string | null;
  variants: Variant[];
};
