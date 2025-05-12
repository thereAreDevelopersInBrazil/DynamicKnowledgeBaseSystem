import { Topic } from "../entities/topics";
import { getById, getChildren } from "../repositories/topics";

export async function buildChildren(
    topic: Topic,
    built: number[] = []
): Promise<Topic> {
    if (topic.getId() && built.includes(topic.getId())) {
        throw new Error(`Circular reference detected at topic ID: ${topic.getId()}`);
    }

    built.push(topic.getId());
    const children = await getChildren(topic.getId());

    if (children && children.length > 0) {
        for (const child of children) {
            const childTopic = await buildChildren(child, built);
            topic.setChildren(childTopic);
        }
    }

    return topic;
}

export async function buildParents(
    topic: Topic,
    built: number[] = []
): Promise<Topic> {
    if (topic.getId() && built.includes(topic.getId())) {
        throw new Error(`Circular reference detected at topic ID: ${topic.getId()}`);
    }

    built.push(topic.getId());

    let parent: Topic | null = null;

    const parentId = topic.getParentTopicId();
    if (parentId) {
        const parentData = await getById(parentId);
        if (parentData) {
            parent = await buildParents(parentData, built);
        }
    }

    topic.setParent(parent);
    return topic;
}