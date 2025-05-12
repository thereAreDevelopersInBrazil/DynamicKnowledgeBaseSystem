import { z } from 'zod';

export const id = z.coerce.number();

export const idSchema = z.object({
  id
});

export const timed = z.object({
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const schema = z.object({
  id,
  isDeleted: z.boolean().optional()
}).merge(timed);

export type Shape = z.infer<typeof schema>;


const possiblyJsonValues = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.record(z.any()),
  z.array(z.any())
], {
  required_error: 'Value is required for replace operation',
  invalid_type_error: 'Value must be a valid JSON value (string, number, boolean, null, object, or array)'
});

// I've partially to follow the RFC rfc6902
// that provide some standands and patterns for PATCH json calls
export const patchSchema = z.object({
  op: z.literal('replace', {
    message: "The only operation allowed for this API PATCH methods is 'replace'"
  }),
  path: z.string().min(1, { message: 'You should provide the name or path to the resource property that will be patched' }),
  value: possiblyJsonValues,
  from: z.never().optional()
});

export type PatchShape = z.infer<typeof patchSchema>;
export type PatchPossibleValues = z.infer<typeof possiblyJsonValues>;