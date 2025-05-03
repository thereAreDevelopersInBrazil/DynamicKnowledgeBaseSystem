import { z } from 'zod';

export const id = z.string().uuid();

export const timed = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const schema = z.object({
  id,
}).merge(timed);

export type Shape = z.infer<typeof schema>;