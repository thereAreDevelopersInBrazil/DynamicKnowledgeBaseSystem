import { z } from 'zod';
import { schema as AEntitySchema, id, idSchema } from '../abstracts';
export const urlSchema = z.string().url({ message: 'The user email should be in an valid URL format!' });
export const descriptionSchema = z.string().min(3, { message: 'You must provide an short description for the resource!' });
export const typeSchema = z.enum(['Video', 'Article', 'Pdf']);

export const articleSchema = z.object({
    publicationDate: z.string().datetime({ message: "Articles publication date should be a valid date time string in ISO 8601 (YYYY-MM-DDTHH:mm:ss)!" })
});

export const pdfSchema = z.object({
    fileSize: z.number({ message: "PDF File Size should be an valid number!" })
});

export const videoSchema = z.object({
    duration: z.string().regex(
        /^\d{1,3}:[0-5]\d$/,
        { message: 'Duration must be in the format HH:MM with hours from 0 to 999 and with minutes from 00 to 59' }
    )
});

export const detailsSchema = z.union([
    articleSchema,
    pdfSchema,
    videoSchema,
], { message: 'The details should be an object compatible with resource type!' });

export const base = z.object({
    url: urlSchema,
    description: descriptionSchema,
    type: typeSchema,
    details: detailsSchema
});
export const schema = base.merge(AEntitySchema);

export type Types = z.infer<typeof typeSchema>;
export type TypesDetails = z.infer<typeof detailsSchema>;

export type DetailsMap = {
    Article: z.infer<typeof articleSchema>;
    Pdf: z.infer<typeof pdfSchema>;
    Video: z.infer<typeof videoSchema>;
};

export type Shape<T extends Types = Types> = Omit<z.infer<typeof schema>, 'details' | 'type'> & {
    type: T;
    details: DetailsMap[T];
};

export const requestsSchema = z.array(
    z.union([id, base], { message: "Each resource must be a valid ID or resource object!" })
);
export type RequestsShape = z.infer<typeof requestsSchema>;
export type BaseShape = z.infer<typeof base>;