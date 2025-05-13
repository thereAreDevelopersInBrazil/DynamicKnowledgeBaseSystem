import { Resources } from "../schemas";
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

export function isResourceShape(value: PatchPossibleValues): value is Resources.Shape<Resources.Types> {
    return (
        Resources.base.safeParse(value).success
    );
}

export function isResourceRequestShape(value: PatchPossibleValues): value is Resources.RequestsShape {
    return (
        Resources.requestsSchema.safeParse(value).success
    );
}