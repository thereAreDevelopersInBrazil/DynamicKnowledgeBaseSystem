import { z } from 'zod';
import { schema as AEntitySchema } from '../abstracts';

export const base = z.object({
    name: z.string().min(1, { message: 'The topic name should have at least 1 character!' }),
    content: z.string({ message: 'The topic content should be an valid string!' }).optional(),
    version: z.number({ message: 'The topic version should be an number!' }).optional()
});

export const schema = base.merge(AEntitySchema);

export const nested = z.lazy(() => schema.merge(z.object({
    parent: schema.optional().nullable()
})));

export type Shape = z.infer<typeof nested>;