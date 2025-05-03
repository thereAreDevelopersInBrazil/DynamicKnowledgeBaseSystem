import { z } from 'zod';

export const id = z.number();

export const idSchema = z.object({
  id
});

export const timed = z.object({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const schema = z.object({
  id,
}).merge(timed);

export type Shape = z.infer<typeof schema>;