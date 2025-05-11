import { z } from 'zod';
import { schema as AEntitySchema } from '../abstracts';

export const RolesSchema = z.enum(['Admin', 'Editor', 'Viewer']);

export const loginSchema = z.object({
    email: z.string().email({ message: 'The user email should be in an valid email format!' }),
    password: z.string()
        .min(6, 'The password must have at least 6 characters')
        .regex(/[a-zA-Z]/, 'The password must have at least one letter')
        .regex(/[0-9]/, 'The password must have at least one number')
        .regex(/[^A-Za-z0-9]/, 'The password must have at least one special character')
});
export const base = z.object({
    name: z.string().min(1, { message: 'The user name should have at least 1 character!' }),
    role: RolesSchema
}).merge(loginSchema);

export const schema = base.merge(loginSchema).merge(AEntitySchema);

export type Roles = z.infer<typeof RolesSchema>;
export type Shape = z.infer<typeof schema>;