import { dbClient } from '../database/client';
import { topics, topics_versions } from '../database/schema';
import { Topic } from '../entities/topics';
import { and, eq, isNull, ne } from 'drizzle-orm';
import { Topics } from '../schemas';
import { buildChildren } from '../factories/topics';
import { PatchPossibleValues } from '../schemas/abstracts';

export async function insert(topic: Topic): Promise<number> {
    const result = await dbClient.insert(topics).values({
        name: topic.getName(),
        content: topic.getContent(),
        parentTopicId: topic.getParentTopicId()
    });

    return Number(result.lastInsertRowid);
}

export async function getAllRootTopics(): Promise<Topic[]> {
    const result = await dbClient.select()
        .from(topics)
        .where(
            and(
                isNull(topics.parentTopicId),
                eq(topics.isDeleted, false),
            )
        );

    if (!result) {
        return [];
    }

    const entities: Topic[] = await Promise.all(result.map(async (result: Topics.Shape) => {
        const topic = new Topic(result);
        return await buildChildren(topic);
    }));

    return entities;
}

export async function getById(id: number, version: number | null = null): Promise<Topic | null> {
    let result;
    [result] = await dbClient.select()
        .from(topics)
        .where(
            and(
                eq(topics.isDeleted, false),
                eq(topics.id, id)
            )
        );
    if (version && version !== result.version) {
        [result] = await dbClient.select({
            id: topics.id,
            name: topics_versions.name,
            version: topics_versions.version,
            content: topics_versions.content,
            parentTopicId: topics_versions.parentTopicId,
            createdAt: topics_versions.createdAt,
            updatedAt: topics_versions.updatedAt,
            isDeleted: topics.isDeleted
        }).from(topics)
            .innerJoin(topics_versions, eq(topics.id, topics_versions.topicId))
            .where(
                and(
                    eq(topics.id, id),
                    eq(topics_versions.version, version),
                )
            );
    }

    if (!result) {
        return null;
    }

    return await buildChildren(new Topic(result));
}

export async function getChildren(id: number): Promise<Topic[]> {
    const children = await dbClient.select()
        .from(topics)
        .where(
            and(
                eq(topics.isDeleted, false),
                eq(topics.parentTopicId, id)
            )
        );
    return children.map((child) => {
        return new Topic(child)
    });
}

export async function getSiblings(id: number, parentId: number | null): Promise<Topic[]> {
    const siblings = await dbClient.select()
        .from(topics)
        .where(
            and(
                ne(topics.id, id),
                parentId ? eq(topics.parentTopicId, parentId) : isNull(topics.parentTopicId)
            )
        );

    return siblings.map((sibling) => {
        return new Topic(sibling);
    });
}

export async function logicalDeletion(id: number): Promise<boolean> {
    const result = await dbClient
        .update(topics)
        .set({ isDeleted: true })
        .where(and(
            eq(topics.id, id),
        ));

    return result.changes > 0;
}

export async function updateSingleProperty(id: number, prop: string, value: PatchPossibleValues, currentVersion: number): Promise<boolean> {
    const result = await dbClient
        .update(topics)
        .set({
            [prop]: value,
            version: currentVersion + 1
        })
        .where(eq(topics.id, id));

    return result.changes > 0;
}

export async function update(id: number, entity: Topic): Promise<boolean> {
    const result = await dbClient
        .update(topics)
        .set({
            name: entity.getName(),
            content: entity.getContent(),
            parentTopicId: entity.getParentTopicId(),
            version: entity.getVersion()
        })
        .where(eq(topics.id, id));

    return result.changes > 0;
}