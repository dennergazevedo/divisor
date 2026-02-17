import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum of 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum of 6 characters"),
  tenantName: z.string().min(2, "Tenant name required"),
  tenantSlug: z.string().min(2, "Tenant URL required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
