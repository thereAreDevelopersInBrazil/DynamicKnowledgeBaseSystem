import { z } from 'zod';

export const id = z.object({
  id: z.string().uuid(),
});

export const timed = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const schema = id.merge(timed);

export type Shape = z.infer<typeof schema>;