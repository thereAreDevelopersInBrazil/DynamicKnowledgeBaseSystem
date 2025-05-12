import { z } from "zod";
import { HTTPSTATUS } from "../constants/http";
import { ExpectedError } from "../errors";
import { getAll, getByUrl, getById, insert, logicalDeletion, update, updateSingleProperty } from "../repositories/resources";
import { PatchShape } from "../schemas/abstracts";
import { AResource } from "../entities/resources/AResource";
import { Resources } from "../schemas";
import { articleSchema, pdfSchema, TypesDetails, videoSchema } from "../schemas/resources";
import { patchValueIsDetail } from "../utils/resources";

export async function retrieveAnResource(id: number): Promise<AResource<Resources.Types>> {
  const resource = await getById(id);

  if (!resource) {
    throw new ExpectedError(HTTPSTATUS.NOT_FOUND, `There are no resource with id ${id}!`);
  }

  return resource;
}

export async function retrieveResources(): Promise<AResource<Resources.Types>[]> {
  const resources = await getAll();
  return resources ? resources : [];
}

export async function createResource(resource: AResource<Resources.Types>): Promise<AResource<Resources.Types>> {

  const sameUrl = await getByUrl(resource.getUrl());

  if (sameUrl) {
    throw new ExpectedError(HTTPSTATUS.UNPROCESSABLE, `This URL is already registered in the resource ID ${sameUrl.getId()}! If you want to change its description or type please edit it instead!`);
  }

  validateDetails(resource.getType(), resource.getDetails());

  const id = await insert(resource);
  if (!id || isNaN(Number(id))) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Error while creating new resource! Unable to detect the created resource!");
  }

  const result = await getById(Number(id));

  if (!result) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Error while creating new resource! Unable to detect the created resource!");
  }

  return result;
}

export async function fullUpdateResource(id: number, resource: AResource<Resources.Types>): Promise<AResource<Resources.Types>> {

  const sameUrl = await getByUrl(resource.getUrl(), id);

  if (sameUrl) {
    throw new ExpectedError(HTTPSTATUS.UNPROCESSABLE, `This URL is already registered in the resource ID ${sameUrl.getId()}! If you want to change its description or type please edit it instead!`);
  }

  validateDetails(resource.getType(), resource.getDetails());

  const isUpdated = await update(id, resource);

  if (!isUpdated) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Unable to detect if the resource was updated!");
  }

  const updated = await getById(id);

  if (!updated) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Unable to retrieve the updated resource!");
  }

  return updated;
}

export async function partialUpdateResource(id: number, patch: PatchShape): Promise<AResource<Resources.Types>> {

  const resource = await getById(id);

  if (!resource) {
    throw new ExpectedError(HTTPSTATUS.NOT_FOUND, `There are no resources with id ${id} to be patched!`);
  }

  const targetProp = String(patch.path);
  const targetPropNewValue = patch.value;

  if (targetProp == 'url') {
    const sameUrl = await getByUrl(String(targetPropNewValue), id);

    if (sameUrl) {
      throw new ExpectedError(HTTPSTATUS.UNPROCESSABLE, `This URL is already registered in the resource ID ${sameUrl.getId()}! If you want to change its description or type please edit it instead!`);
    }
  }

  // I removed the possibility of updating type alone, cause its impossible to patch type alone
  // Why? when type change we MUST provide an valid kind of details, so its always a double update
  // and double updates should use PUT
  const validProps = ['url', 'description', 'details'];

  if (!validProps.includes(targetProp)) {
    throw new ExpectedError(HTTPSTATUS.BAD_REQUEST, `Invalid path: ${patch.path} - You can only patch the paths: ${validProps.join(", ")} of Resources`);
  }

  // There are other ways to do it but i decided do it dynamically
  // so i can use a "strategy alike / similar" approach
  const possibleValidations: { [key: string]: z.ZodTypeAny } = {
    url: Resources.urlSchema,
    description: Resources.descriptionSchema,
    type: Resources.typeSchema,
    details: Resources.detailsSchema
  };

  try {
    possibleValidations[targetProp].parse(targetPropNewValue);
  } catch (error) {
    throw new ExpectedError(HTTPSTATUS.BAD_REQUEST, `Invalid value for ${targetProp} '${targetPropNewValue}'`, error);
  }

  if (targetProp == 'details') {
    if (!targetPropNewValue || !patchValueIsDetail(targetPropNewValue)) {
      throw new ExpectedError(HTTPSTATUS.BAD_REQUEST, `Invalid details for ${resource.getType()}!`, { providedDetails: targetPropNewValue });
    }
    validateDetails(resource.getType(), targetPropNewValue);
  }

  const result = await updateSingleProperty(id, targetProp, targetPropNewValue);

  if (!result) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Unable to detect if the resource was updated!");
  }

  const updated = await getById(id);

  if (!updated) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Unable to retrieve the updated resource!");
  }

  return updated;
}

export async function deleteResource(id: number): Promise<boolean> {
  const resource = await getById(id);

  if (!resource) {
    throw new ExpectedError(HTTPSTATUS.NOT_FOUND, `There are no resources with id ${id} to be deleted!`);
  }

  const result = await logicalDeletion(id);

  if (!result) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Unable to delete resource!");
  }

  return result;
}

function validateDetails(type: string, details: TypesDetails) {
  try {
    const schemaMap = {
      Article: articleSchema,
      Pdf: pdfSchema,
      Video: videoSchema,
    } as const;

    schemaMap[type as keyof typeof schemaMap].parse(details);
  } catch (error) {
    throw new ExpectedError(HTTPSTATUS.BAD_REQUEST, `Invalid details for ${type}!`, error);
  }
}