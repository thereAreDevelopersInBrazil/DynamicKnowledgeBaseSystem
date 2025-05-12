import { PatchPossibleValues } from "../schemas/abstracts";
import { articleSchema, pdfSchema, videoSchema } from "../schemas/resources";
import { TypesDetails } from "../schemas/resources";

export function patchValueIsDetail(value: PatchPossibleValues): value is TypesDetails {
    return (
        articleSchema.safeParse(value).success ||
        pdfSchema.safeParse(value).success ||
        videoSchema.safeParse(value).success
    );
}