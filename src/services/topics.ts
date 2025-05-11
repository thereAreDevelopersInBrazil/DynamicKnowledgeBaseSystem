import { z } from "zod";
import { HTTPSTATUS } from "../constants/http";
import { Topic } from "../entities/topics";
import { ExpectedError } from "../errors";
import { insert as insertTopics, getById, getChildren, getSiblings, storeVersion, getNumberOfPreviousVersions, updateSingleProperty, update } from "../repositories/topics";
import { Topics } from "../schemas";
import { PatchShape } from "../schemas/abstracts";
import { contentSchema, nameSchema } from "../schemas/topics";

export async function createTopic(topic: Topic): Promise<number | bigint> {
  const parentId = topic.getParentTopicId();
  if (parentId !== null) {
    const parentTopicIdIsValid = await parentTopicIdExists(parentId);
    if (!parentTopicIdIsValid) {
      throw ("Please provide an valid parent for the topic!");
    }
  }

  const insertedId = await insertTopics(topic);

  return insertedId;
}

export async function fullUpdateTopic(id: number, data: Topics.Shape): Promise<Topics.Shape> {
  const targetResult = await getById(Number(id));
  if (!targetResult || !targetResult.id) {
    throw new ExpectedError(HTTPSTATUS.NOT_FOUND, `There are no topics with id ' ${id} to be updated!`);
  }

  await storeVersion(targetResult);

  const numberOfPreviousVersions = await getNumberOfPreviousVersions(targetResult.id);

  const updatedTopic: Topics.Shape = {
    id: targetResult.id,
    name: data.name,
    content: data.content ? data.content : targetResult.content,
    parentTopicId: data.parentTopicId,
    version: numberOfPreviousVersions + 1,
    createdAt: targetResult.createdAt,
    updatedAt: new Date().toISOString()
  }
  const isUpdated = await update(targetResult, updatedTopic);
  let topicNewVersion;
  if (isUpdated) {
    topicNewVersion = await getById(targetResult.id);
  }
  return topicNewVersion ? topicNewVersion : targetResult;
}

export async function partialUpdateTopic(id: number, patch: PatchShape): Promise<Topics.Shape> {
  const targetResult = await getById(id);
  if (!targetResult) {
    throw new ExpectedError(HTTPSTATUS.NOT_FOUND, `There are no topics with id ${id} to be patched!`);
  }

  const targetProp = String(patch.path);
  const targetPropNewValue = patch.value;
  const validProps = ['name', 'content'];
  if (!validProps.includes(targetProp)) {
    throw new ExpectedError(HTTPSTATUS.BAD_REQUEST, `Invalid path: ${patch.path} - You can only patch the paths: 'name' and 'content' of Topics`);
  }

  // There are other ways to do it but i decided do it dynamically
  // so i can use a "strategy alike / similar" approach
  const possibleValidations: { [key: string]: z.ZodTypeAny } = {
    name: nameSchema,
    content: contentSchema
  };

  try {
    possibleValidations[targetProp].parse(targetPropNewValue);
  } catch (error) {
    throw new ExpectedError(HTTPSTATUS.BAD_REQUEST, `Invalid value for ${targetProp} '${targetPropNewValue}'`, error);
  }

  await storeVersion(targetResult);

  const numberOfPreviousVersions = await getNumberOfPreviousVersions(targetResult.id);

  const isUpdated = await updateSingleProperty(targetResult, targetProp, String(targetPropNewValue), numberOfPreviousVersions);
  let topicNewVersion;
  if (isUpdated) {
    topicNewVersion = await getById(targetResult.id);
  }
  return topicNewVersion ? topicNewVersion : targetResult;
}

export async function getTopicWithParentsById(id: number): Promise<Topic | null> {
  let response = null;
  const topicResult = await getById(id);
  if (topicResult) {
    response = await buildParents(topicResult);
  }
  return response;
}

export async function buildParents(
  data: Topics.Shape,
  visitedIds = new Set<number>()
): Promise<Topic> {
  if (data.id && visitedIds.has(data.id)) {
    throw new Error(`Circular reference detected at topic ID: ${data.id}`);
  }

  if (data.id) visitedIds.add(data.id);

  let nextParent: Topic | null = null;

  if (data.parentTopicId) {
    const parentData = await getById(data.parentTopicId);
    if (parentData) {
      nextParent = await buildParents(parentData, visitedIds);
    }
  }

  const builtTopic = new Topic(data);
  builtTopic.setParent(nextParent);
  return builtTopic;
}

export async function buildChildren(
  data: Topics.Shape,
  visitedIds = new Set<number>()
): Promise<Topic> {
  if (data.id && visitedIds.has(data.id)) {
    throw new Error(`Circular reference detected at topic ID: ${data.id}`);
  }

  if (data.id) visitedIds.add(data.id);
  const topicChildren = await getChildren(data.id);

  const builtTopic = new Topic(data);

  if (topicChildren && topicChildren.length > 0) {
    for (const childData of topicChildren) {
      const childTopic = await buildChildren(childData, new Set(visitedIds));
      builtTopic.setChildren(childTopic);
    }
  }

  return builtTopic;
}

export async function parentTopicIdExists(parentId: number): Promise<boolean> {
  const result = await getById(parentId);
  return result ? true : false;
}

// @TODO - Transfer types for an proper exclusive types file
type Directions = 'self' | 'up' | 'down' | 'sides';
const ALL_DIRECTIONS = ['self', 'up', 'down', 'sides']
type Instruction = {
  fromTopicId: number,
  direction: Directions,
  originFromRoot: Directions
};

export type ExecutedInstruction = Instruction & {
  toTopicId: number,
};

type SearchTree = {
  self: ExecutedInstruction[],
  up: ExecutedInstruction[],
  down: ExecutedInstruction[],
  sides: ExecutedInstruction[]
}



export async function findShortestPathBetweenTopics(originTopicId: number, targetTopicId: number): Promise<ExecutedInstruction[] | false> {

  const originTopicResult = await getById(originTopicId);
  if (!originTopicResult) {
    throw new Error(`${HTTPSTATUS.BAD_REQUEST} - Please provide an valid origin topic id!`);
  }

  const targetTopicResult = await getById(targetTopicId);
  if (!targetTopicResult) {
    throw new Error(`${HTTPSTATUS.BAD_REQUEST} - Please provide an valid target topic id!`);
  }

  const queue: Instruction[] = [];
  const executedInstructions: Instruction[] = [];
  const searchTree: SearchTree = {
    self: [],
    up: [],
    down: [],
    sides: []
  };

  feedInitialQueueInstructions(queue, originTopicId);

  const search = await processQueue(queue, executedInstructions, searchTree, targetTopicId);

  console.log('Search finished with ' + executedInstructions.length + ' instructions executed!');
  return search ? getSuccessfullSearch(search) : false;
}

function feedInitialQueueInstructions(queue: Instruction[], originTopicId: number) {
  const directions = ALL_DIRECTIONS;

  for (const direction of directions) {
    queue.push({
      fromTopicId: originTopicId,
      direction: direction as Directions,
      originFromRoot: direction as Directions
    });
  }
}

async function processQueue(queue: Instruction[], executedInstructions: Instruction[], searchTree: SearchTree, targetTopicId: number): Promise<ExecutedInstruction[] | false> {
  while (queue.length > 0) {
    const currentInstruction = queue.shift();
    if (!currentInstruction) {
      break;
    }
    if (executedInstructions.includes(currentInstruction)) {
      continue;
    }
    switch (currentInstruction?.direction) {
      case 'self': {
        const executedInstruction = {
          ...currentInstruction,
          toTopicId: currentInstruction.fromTopicId
        };
        executedInstructions.push(currentInstruction);
        searchTree[currentInstruction.originFromRoot].push(executedInstruction);
        if (currentInstruction.fromTopicId == targetTopicId) {
          return searchTree[currentInstruction.originFromRoot];
        }
        break;
      }
      case 'up': {
        const currentTopicDetails = await getById(currentInstruction.fromTopicId);
        if (!currentTopicDetails) {
          console.log("Invalid Instruction: Topic dosent exists!", currentInstruction);
          continue;
        }
        if (currentTopicDetails.parentTopicId == null) {
          console.log("Invalid Instruction: search UP in a topic with no parents!", currentInstruction);
          continue;
        }
        const parentTopicDetails = await getById(currentTopicDetails.parentTopicId);

        if (parentTopicDetails && parentTopicDetails.id) {
          const executedInstruction = {
            ...currentInstruction,
            toTopicId: parentTopicDetails?.id
          };
          executedInstructions.push(currentInstruction);
          searchTree[currentInstruction.originFromRoot].push(executedInstruction);

          if (parentTopicDetails.id == targetTopicId) {
            return searchTree[currentInstruction.originFromRoot];
          }

          const possiblyDirectionsToKeepTheSearch: Directions[] = ['up', 'sides'];

          feedQueueWithInstructions(queue, parentTopicDetails.id, currentInstruction.originFromRoot, possiblyDirectionsToKeepTheSearch);
        }
        break;
      }
      case 'down': {
        const currentTopicDetails = await getById(currentInstruction.fromTopicId);
        if (!currentTopicDetails) {
          console.log("Invalid Instruction: Topic dosent exists!", currentInstruction);
          continue;
        }

        const children = await getChildren(currentTopicDetails.id);

        if (!children || children.length == 0) {
          console.log("Invalid Instruction: search DOWN in a topic with no children!", currentInstruction);
          continue;
        }

        for (const child of children) {
          const executedInstruction = {
            ...currentInstruction,
            toTopicId: child.id
          };

          executedInstructions.push(currentInstruction);
          searchTree[currentInstruction.originFromRoot].push(executedInstruction);

          if (child.id == targetTopicId) {
            return searchTree[currentInstruction.originFromRoot];
          }

          // I think i dont need to cover sides cause the for loop is already
          // covering all siblings, so, for each sibling I queue just going further down
          const possiblyDirectionsToKeepTheSearch: Directions[] = ['down'];

          feedQueueWithInstructions(queue, child.id, currentInstruction.originFromRoot, possiblyDirectionsToKeepTheSearch);

        }

        break;
      }

      case 'sides': {
        const currentTopicDetails = await getById(currentInstruction.fromTopicId);
        if (!currentTopicDetails) {
          console.log("Invalid Instruction: Topic dosent exists!", currentInstruction);
          continue;
        }

        const siblings = await getSiblings(currentTopicDetails.id, currentTopicDetails.parentTopicId);

        if (!siblings || siblings.length == 0) {
          console.log("Invalid Instruction: search SIDES in a topic with no siblings!", currentInstruction);
          continue;
        }

        for (const sibling of siblings) {
          const executedInstruction = {
            ...currentInstruction,
            toTopicId: sibling.id
          };

          executedInstructions.push(currentInstruction);
          searchTree[currentInstruction.originFromRoot].push(executedInstruction);

          if (sibling.id == targetTopicId) {
            return searchTree[currentInstruction.originFromRoot];
          }

          // I think that in this very specific case where I searched horizontally
          // and the for loop will search horizontally in all its extension
          // I just need to schedule searches for up and down
          const possiblyDirectionsToKeepTheSearch: Directions[] = ['up', 'down'];

          feedQueueWithInstructions(queue, sibling.id, currentInstruction.originFromRoot, possiblyDirectionsToKeepTheSearch);

        }

        break;
      }
    }
  }
  return false;
}

function feedQueueWithInstructions(queue: Instruction[], topicId: number, searchTreeRoot: Directions, directions: Directions[]) {
  for (const direction of directions) {
    queue.push({
      fromTopicId: topicId,
      direction: direction,
      originFromRoot: searchTreeRoot
    });
  }
}

function getSuccessfullSearch(searches: ExecutedInstruction[]): ExecutedInstruction[] | false {
  const successfullSearch: ExecutedInstruction[] = [];
  const finalSearch = searches.pop();
  if (!finalSearch) {
    return false;
  }
  successfullSearch.push(finalSearch);
  searches.reverse();

  let currentSuccessfullSearchNode = finalSearch.fromTopicId;
  for (const search of searches) {
    if (search.toTopicId == currentSuccessfullSearchNode) {
      successfullSearch.push(search);
      currentSuccessfullSearchNode = search.fromTopicId;
    }
  }

  return successfullSearch.reverse();
}