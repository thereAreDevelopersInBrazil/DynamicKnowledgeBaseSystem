import { z } from 'zod';
import { schema as AEntitySchema } from '../abstracts';

export const RolesSchema = z.enum(['Admin', 'Editor', 'Viewer']);

export const base = z.object({
    name: z.string().min(1, {message: 'The user name should have at least 1 character!'}),
    email: z.string().email({message: 'The user email should be in an valid email format!'}),
    role: RolesSchema
});

export const schema = base.merge(AEntitySchema);

export type Roles = z.infer<typeof RolesSchema>;
export type Shape = z.infer<typeof schema>;