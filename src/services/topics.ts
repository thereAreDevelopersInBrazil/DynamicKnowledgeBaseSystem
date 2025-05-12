import { z } from "zod";
import { HTTPSTATUS } from "../constants/http";
import { ExpectedError } from "../errors";
import { idSchema, PatchShape } from "../schemas/abstracts";
import { Topic } from "../entities/topics";
import { getAllRootTopics, getById, insert, logicalDeletion, update, updateSingleProperty } from "../repositories/topics";
import { getNumberOfPreviousVersions, storeVersion } from "../repositories/topicsVersions";
import { contentSchema, nameSchema } from "../schemas/topics";

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

export async function createTopic(topic: Topic): Promise<Topic> {
  const id = await insert(topic);
  if (!id || isNaN(Number(id))) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Error while creating new topic! Unable to detect the created topic!");
  }

  const result = await getById(Number(id));

  if (!result) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Error while creating new topic! Unable to detect the created topic!");
  }

  return result;
}

export async function fullUpdateTopic(id: number, topicUpdates: Topic): Promise<Topic> {

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

  const updated = await getById(id);

  if (!updated) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Unable to retrieve the updated topic!");
  }

  return updated;
}

export async function partialUpdateTopic(id: number, patch: PatchShape): Promise<Topic> {

  const currentTopic = await getById(id);

  if (!currentTopic) {
    throw new ExpectedError(HTTPSTATUS.NOT_FOUND, `There are no topics with id ${id} to be patched!`);
  }

  await storeVersion(currentTopic);

  const currentVersion = await getNumberOfPreviousVersions(currentTopic.getId());
  const targetProp = String(patch.path);
  const targetPropNewValue = patch.value;

  const validProps = ['name', 'content', 'parentTopicId'];

  if (!validProps.includes(targetProp)) {
    throw new ExpectedError(HTTPSTATUS.BAD_REQUEST, `Invalid path: ${patch.path} - You can only patch the paths: ${validProps.join(", ")} of Topics`);
  }

  // There are other ways to do it but i decided do it dynamically
  // so i can use a "strategy alike / similar" approach
  const possibleValidations: { [key: string]: z.ZodTypeAny } = {
    name: nameSchema,
    content: contentSchema,
    parentTopicId: idSchema,
  };

  try {
    possibleValidations[targetProp].parse(targetPropNewValue);
  } catch (error) {
    throw new ExpectedError(HTTPSTATUS.BAD_REQUEST, `Invalid value for ${targetProp} '${targetPropNewValue}'`, error);
  }

  const result = await updateSingleProperty(id, targetProp, targetPropNewValue, currentVersion);

  if (!result) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Unable to detect if the topic was updated!");
  }

  const updated = await getById(id);

  if (!updated) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Unable to retrieve the updated topic!");
  }

  return updated;
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