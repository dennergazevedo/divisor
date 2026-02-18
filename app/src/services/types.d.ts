type RegisterPayload = {
  email: string;
  password: string;
  name?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};
