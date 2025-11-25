import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.email("Share a valid email"),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(64, "Keep it under 64 characters"),
});

export const signUpSchema = credentialsSchema.extend({
  name: z.string().min(2, "Give us a name").max(80, "Keep names concise"),
});

export type CredentialsInput = z.infer<typeof credentialsSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;

