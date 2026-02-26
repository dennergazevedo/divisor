import { z } from "zod";

export const supportSchema = z.object({
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type SupportFormData = z.infer<typeof supportSchema>;
