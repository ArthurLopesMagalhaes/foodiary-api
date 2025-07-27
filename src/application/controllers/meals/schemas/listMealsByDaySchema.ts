import z from 'zod';

export const listMealByDaySchema = z.object({
  date: z.string()
    .min(1, '"date" is required')
    .date('"date" must be a valid date. Format: YYYY-MM-DD')
    .transform((date) => new Date(date)),
});
