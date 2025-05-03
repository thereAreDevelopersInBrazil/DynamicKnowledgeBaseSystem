import { Topic } from "../entities/topics";
import { insert as insertTopics, getById, getChildren } from "../repositories/topics";
import { insert as insertTopicsTree } from "../repositories/topics_tree";
import { Topics } from "../schemas";

export async function createTopic(topic: Topic): Promise<number | bigint> {
  const parentId = topic.getParentTopicId();
  if (parentId !== null) {
    const parentTopicIdIsValid = await parentTopicIdExists(parentId);
    if (!parentTopicIdIsValid) {
      throw ("Please provide an valid parent for the topic!");
    }
  }

  const insertedId = await insertTopics(topic);

  if (insertedId) {
    await insertTopicsTree(insertedId);
  }

  return insertedId;
}

export async function getTopicTreeById(id: number): Promise<number[]> {
  const topicTree: number[] = [];
  topicTree.push(id);
  let current = await getById(id);
  while (current) {
    if (!current.parentTopicId) {
      break;
    }
    if (topicTree.includes(current.parentTopicId)) {
      throw new Error('Error: Circular reference detected at topic ID ' + current.id + ' referencing parent ID ' + current.parentTopicId);
    }

    topicTree.push(current.parentTopicId);
    current = await getById(current.parentTopicId);
  }
  return topicTree;
}

export async function getTopicWithParentsById(id: number): Promise<Topic | null> {
  let response = null;
  const topicResult = await getById(id);
  if (topicResult) {
    response = await buildParents(topicResult);
  }
  return response;
}

export async function getTopicWithChildrenById(id: number): Promise<Topics.Shape[] | null> {
  const topicData = await getById(id);
  if (!topicData) {
    return null;
  }
  const topic = new Topic(topicData);
  const topicsBellowCurrentTopic = await getChildren(topic);
  const topicsBellowNested = nestChildren(topicsBellowCurrentTopic, topic.getId());

  return topicsBellowNested;
}

export function nestChildren(topics: Topics.Shape[], rootTopicId: number): Topics.Shape[] {
  const flatTopics = topics.map((topic) => ({
    ...topic,
    children: [],
    parent: null,
  }));

  const topicMap = new Map<number, Topics.Shape>();
  flatTopics.forEach((topic) => {
    topicMap.set(topic.id, topic);
  });

  const rootTopics: Topics.Shape[] = [];
  topicMap.forEach((topic) => {
    if (topic.parentTopicId === rootTopicId) {
      rootTopics.push(topic);
    } else if (topic.parentTopicId !== null && topicMap.has(topic.parentTopicId)) {
      topicMap.get(topic.parentTopicId)!.children!.push(topic);
      topic.parent = topicMap.get(topic.parentTopicId) || null;
    }
  });

  topicMap.forEach((topic) => {
    topic.children!.sort((a, b) => a.id - b.id);
  });

  return rootTopics;
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
