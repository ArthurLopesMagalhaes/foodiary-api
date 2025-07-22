import { Profile } from '@application/entities/Profile';
import z from 'zod';

export const signUpSchema = z.object({
  account: z.object({
    email: z.string().min(1, '"email" is required').email('Invalid email'),
    password: z.string().min(8, '"password" must be at least 8 characters long'),
  }),
  profile: z.object({
    name: z.string().min(1, '"name" is required'),
    birthDate: z.string()
      .min(1, '"birthDate" is required')
      .date('"birthDate" must be a valid date. Format: YYYY-MM-DD')
      .transform((date) => new Date(date)),
    gender: z.nativeEnum(Profile.Gender, { message: '"gender" must be one of: MALE, FEMALE' }),
    height: z.number().min(0, '"height" must be a positive number'),
    weight: z.number().min(0, '"weight" must be a positive number'),
    goal: z.nativeEnum(Profile.Goal, { message: '"goal" must be one of: LOSE, MAINTAIN, GAIN' }),
    activityLevel: z.nativeEnum(Profile.ActivityLevel, { message: '"activityLevel" must be one of: SEDENTARY, LIGHT, MODERATE, HEAVY, ATHLETE' }),
  }),
});

export type SignUpBody = z.infer<typeof signUpSchema>;
