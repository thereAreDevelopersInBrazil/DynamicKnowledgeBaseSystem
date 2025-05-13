import { z } from 'zod';
import { schema as AEntitySchema, id } from '../abstracts';
import * as Resources from '../resources';

export const getSchema = z.object({
    version: z.coerce
        .number({ message: "Version should be a number!" })
        .int({ message: "Version should be an integer number!" })
        .gte(1, { message: "Version should be greater or equal than 1!" })
        .optional()
});

export const getPathSchema = z.object({
    origin_topic_id: z.coerce
        .number({ message: "The origin topic id should be a number!" })
        .int({ message: "The origin topic id should be an integer number!" })
        .gte(1, { message: "The origin topic id should be greater or equal than 1!" }),
    target_topic_id: z.coerce
        .number({ message: "The target topic id should be a number!" })
        .int({ message: "The target topic id should be an integer number!" })
        .gte(1, { message: "The target topic id should be greater or equal than 1!" }),
});

export const nameSchema = z.string().min(1, { message: 'The topic name should have at least 1 character!' });
export const contentSchema = z.string({ message: 'If provided, the topic content should be an valid string!' }).optional().nullable();
export const parentTopicIdSchema = z.number({ message: "The parent topic id is required! If you want to create new root topic send 'null' it will be accepted!" })
    .nullable();

export const base = z.object({
    name: nameSchema,
    content: contentSchema,
    parentTopicId: parentTopicIdSchema,
    resources: z.array(Resources.base).optional().default([])
});

export const requestSchema = z.object({
    name: nameSchema,
    content: contentSchema,
    parentTopicId: parentTopicIdSchema,
    resources: Resources.requestsSchema.optional()
});

export const internal = z.object({ version: z.number({ message: 'The topic version should be an number!' }).optional().nullable() });


export const schema = base.merge(internal).merge(AEntitySchema);

export const nested = z.lazy(() => schema.merge(z.object({
    parent: schema.optional().nullable(),
    children: z.array(schema).optional(),
})));

export type Shape = z.infer<typeof nested>;