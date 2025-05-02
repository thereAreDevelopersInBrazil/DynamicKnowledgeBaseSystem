import { z } from 'zod';
import { schema as AEntitySchema } from '../abstracts';

export const roles = z.enum(['Admin', 'Editor', 'Viewer']);

export const base = z.object({
    name: z.string().min(1, {message: 'The user name should have at least 1 character!'}),
    email: z.string().email({message: 'The user email should be in an valid email format!'}),
    role: roles
});

export const schema = base.merge(AEntitySchema);

export type roles = z.infer<typeof roles>;
export type Shape = z.infer<typeof schema>;