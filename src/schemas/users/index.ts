import { z } from 'zod';
import { schema as AEntitySchema } from '../abstracts';

export const nameSchema = z.string().min(1, { message: 'The user name should have at least 1 character!' });
export const emailSchema = z.string().email({ message: 'The user email should be in an valid email format!' });
export const passwordSchema = z.string()
    .min(6, 'The password must have at least 6 characters')
    .regex(/[a-zA-Z]/, 'The password must have at least one letter')
    .regex(/[0-9]/, 'The password must have at least one number')
    .regex(/[^A-Za-z0-9]/, 'The password must have at least one special character');

export const roleSchema = z.enum(['Admin', 'Editor', 'Viewer']);

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema
});
export const base = z.object({
    name: nameSchema,
    role: roleSchema
}).merge(loginSchema);

export const schema = base.merge(loginSchema).merge(AEntitySchema);

export type Roles = z.infer<typeof roleSchema>;
export type Shape = z.infer<typeof schema>;