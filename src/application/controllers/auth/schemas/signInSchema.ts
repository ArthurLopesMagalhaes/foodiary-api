import z from 'zod';

export const signInSchema = z.object({
  email: z.string().min(1, '"email" is required').email('Invalid email'),
  password: z.string()
    .min(1, '"password" is required')
    .min(6, '"password" must be at least 6 characters long'),
});

export type SignInBody = z.infer<typeof signInSchema>;
