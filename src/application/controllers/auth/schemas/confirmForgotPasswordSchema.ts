import z from 'zod';

export const ConfirmForgotPasswordSchema = z.object({
  email: z.string().min(1, '"email" is required').email('Invalid email'),
  code: z.string().min(1, '"code" is required'),
  newPassword: z.string().min(8, '"newPassword" must be at least 8 characters long'),
});

export type ConfirmForgotPasswordBody = z.infer<typeof ConfirmForgotPasswordSchema>;
