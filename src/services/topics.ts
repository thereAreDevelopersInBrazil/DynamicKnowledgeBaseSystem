import { z } from "zod";
import { HTTPSTATUS } from "../constants/http";
import { ExpectedError } from "../errors";
import { idSchema, PatchShape } from "../schemas/abstracts";
import { Topic } from "../entities/topics";
import { getAllRootTopics, getById, insert, logicalDeletion, update, updateSingleProperty } from "../repositories/topics";
import { getNumberOfPreviousVersions, storeVersion } from "../repositories/topicsVersions";
import { contentSchema, nameSchema } from "../schemas/topics";
import { attachResourcesToTopics } from "./resources";
import { buildResourcesFromMixed } from "../factories/resources";
import { WarningExposedResponse } from "../types";
import { AResource } from "../entities/resources/AResource";
import { Resources } from "../schemas";
import { isResourceRequestShape } from "../utils/resources";

export async function retrieveAnTopic(id: number, version?: number | null): Promise<Topic> {
  const topic = await getById(id, version);

  if (!topic) {
    throw new ExpectedError(HTTPSTATUS.NOT_FOUND, `There are no topics with id ${id}!`);
  }

  return topic;
}

export async function retrieveAllRootTopics(): Promise<Topic[]> {
  const topics = await getAllRootTopics();
  return topics ? topics : [];
}

export async function createTopic(topic: Topic, resources: Resources.RequestsShape): Promise<WarningExposedResponse> {
  const id = await insert(topic);

  if (!id || isNaN(Number(id))) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Error while creating new topic! Unable to detect the created topic!");
  }

  const microTask1Response = await buildResourcesFromMixed(resources);
  const microTask2Response = await attachResourcesToTopics(microTask1Response.response as AResource<Resources.Types>[], id);

  const microTasksWarnings = [...microTask1Response.warnings, ...microTask2Response.warnings];

  const result = await getById(Number(id));

  if (!result) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Error while creating new topic! Unable to detect the created topic!");
  }

  return {
    response: result,
    warnings: microTasksWarnings
  };
}

export async function fullUpdateTopic(id: number, topicUpdates: Topic, resources: Resources.RequestsShape): Promise<WarningExposedResponse> {

  const currentTopic = await getById(id);

  if (!currentTopic) {
    throw new ExpectedError(HTTPSTATUS.NOT_FOUND, `There are no topic with id ${id} to be updated!`);
  }

  await storeVersion(currentTopic);

  const numberOfPreviousVersions = await getNumberOfPreviousVersions(currentTopic.getId());

  topicUpdates.setVersion(numberOfPreviousVersions + 1);

  const isUpdated = await update(id, topicUpdates);

  if (!isUpdated) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Unable to detect if the topic was updated!");
  }

  const microTask1Response = await buildResourcesFromMixed(resources);
  const microTask2Response = await attachResourcesToTopics(microTask1Response.response as AResource<Resources.Types>[], id);

  const microTasksWarnings = [...microTask1Response.warnings, ...microTask2Response.warnings];

  const updated = await getById(id);

  if (!updated) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Unable to retrieve the updated topic!");
  }

  return {
    response: updated,
    warnings: microTasksWarnings
  }
}

export async function partialUpdateTopic(id: number, patch: PatchShape): Promise<WarningExposedResponse> {

  const currentTopic = await getById(id);

  if (!currentTopic) {
    throw new ExpectedError(HTTPSTATUS.NOT_FOUND, `There are no topics with id ${id} to be patched!`);
  }

  await storeVersion(currentTopic);

  const currentVersion = await getNumberOfPreviousVersions(currentTopic.getId());
  const targetProp = String(patch.path);
  const targetPropNewValue = patch.value;

  const validProps = ['name', 'content', 'parentTopicId', 'resources'];

  if (!validProps.includes(targetProp)) {
    throw new ExpectedError(HTTPSTATUS.BAD_REQUEST, `Invalid path: ${patch.path} - You can only patch the paths: ${validProps.join(", ")} of Topics`);
  }

  // There are other ways to do it but i decided do it dynamically
  // so i can use a "strategy alike / similar" approach
  const possibleValidations: { [key: string]: z.ZodTypeAny } = {
    name: nameSchema,
    content: contentSchema,
    parentTopicId: idSchema,
    resources: Resources.requestsSchema
  };

  try {
    possibleValidations[targetProp].parse(targetPropNewValue);
  } catch (error) {
    throw new ExpectedError(HTTPSTATUS.BAD_REQUEST, `Invalid value for ${targetProp} '${targetPropNewValue}'`, error);
  }

  let warnings: string[] = [];

  if (targetProp == 'resources' && isResourceRequestShape(targetPropNewValue)) {

    const microTask1Response = await buildResourcesFromMixed(targetPropNewValue);
    const microTask2Response = await attachResourcesToTopics(microTask1Response.response as AResource<Resources.Types>[], id);

    warnings = [...microTask1Response.warnings, ...microTask2Response.warnings];
  }

  const result = await updateSingleProperty(id, targetProp, targetPropNewValue, currentVersion);

  if (!result) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Unable to detect if the topic was updated!");
  }

  const updated = await getById(id);

  if (!updated) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Unable to retrieve the updated topic!");
  }

  return {
    response: updated,
    warnings: warnings
  };
}

export async function deleteTopic(id: number): Promise<boolean> {
  const topic = await getById(id);

  if (!topic) {
    throw new ExpectedError(HTTPSTATUS.NOT_FOUND, `There are no topics with id ${id} to be deleted!`);
  }

  const result = await logicalDeletion(id);

  if (!result) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Unable to delete topic!");
  }

  return result;
}