import { z } from 'zod';
import { schema as AEntitySchema } from '../abstracts';

export const base = z.object({
    name: z.string().min(1, { message: 'The topic name should have at least 1 character!' }),
    content: z.string({ message: 'If provided, the topic content should be an valid string!' }).optional().nullable(),
    parentTopicId: z.number({message: 'If provided, the id of the parent topic should be an valid number!'}).nullable()
});


export const internal = z.object({ version: z.number({ message: 'The topic version should be an number!' }).optional().nullable() });

export const schema = base.merge(internal).merge(AEntitySchema);

export const nested = z.lazy(() => schema.merge(z.object({
    parent: schema.optional().nullable(),
    children: z.array(schema).optional(),
})));

export type Shape = z.infer<typeof nested>;