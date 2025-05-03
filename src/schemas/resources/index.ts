import { z } from 'zod';
import { schema as AEntitySchema, id } from '../abstracts';

export const TypesSchema = z.enum(['Video', 'Article', 'Pdf']);

export const base = z.object({
    topicId: id,
    url: z.string().url({message: 'The user email should be in an valid URL format!'}),
    description: z.string().min(3, {message: 'You must provide an short description for the resource!'}),
    type: TypesSchema
});

export const schema = base.merge(AEntitySchema);

export type Types = z.infer<typeof TypesSchema>;
export type Shape = z.infer<typeof schema>;