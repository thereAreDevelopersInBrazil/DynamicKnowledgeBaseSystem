import { dbClient } from '../database/client';
import { topics, topics_versions } from '../database/schema';
import { Topic } from '../entities/topics';
import { and, asc, eq, isNull, ne, sql } from 'drizzle-orm';
import { Topics } from '../schemas';

export async function insert(topic: Topic): Promise<number> {
    const result = await dbClient.insert(topics).values({
        name: topic.getName(),
        content: topic.getContent(),
        parentTopicId: topic.getParentTopicId()
    });

    return Number(result.lastInsertRowid);
}

export async function getFirstTopic(): Promise<Topics.Shape | null> {
    const result = await dbClient.select()
        .from(topics)
        .where(eq(topics.isDeleted, false))
        .orderBy(asc(topics.id))
        .limit(1);
    return result[0] ? result[0] : null;
}

export async function getById(id: number, version: number | null = null): Promise<Topics.Shape | null> {
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
        [result] = await dbClient.select()
            .from(topics_versions)
            .where(
                and(
                    eq(topics_versions.version, version),
                    eq(topics_versions.topicId, id)
                )
            );
    }

    return result;
}

export async function getChildren(id: number): Promise<Topics.Shape[]> {
    return await dbClient.select()
        .from(topics)
        .where(
            and(
                eq(topics.isDeleted, false),
                eq(topics.parentTopicId, id)
            )
        );
}

export async function getSiblings(id: number, parentId:number | null): Promise<Topics.Shape[]> {
    return await dbClient.select()
    .from(topics)
    .where(
        and(
            ne(topics.id, id),
            parentId ? eq(topics.parentTopicId, parentId) : isNull(topics.parentTopicId)
        )
    );
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

export async function storeVersion(topic: Topics.Shape): Promise<number> {
    const result = await dbClient
        .insert(topics_versions)
        .values({
            topicId: topic.id,
            name: topic.name,
            content: topic.content,
            parentTopicId: topic.parentTopicId,
            version: topic.version,
            createdAt: topic.createdAt,
            updatedAt: topic.updatedAt,
        });

    return Number(result.lastInsertRowid);
}

export async function getNumberOfPreviousVersions(id: number): Promise<number> {
    const result = await dbClient
        .select({ count: sql`count(*)`.mapWith(Number) }).from(topics_versions)
        .where(eq(topics_versions.topicId, id));
    return result[0] ? result[0].count : 0;
}

export async function updateSingleProperty(target: Topics.Shape, targetProp: string, targetPropNewValue: string, numberOfPreviousVersions: number): Promise<boolean> {
    const result = await dbClient
        .update(topics)
        .set({
            [targetProp]: targetPropNewValue,
            version: numberOfPreviousVersions + 1,
            updatedAt: new Date().toISOString()
        })
        .where(eq(topics.id, target.id));

    return result.changes > 0;
}

export async function update(targetTopic: Topics.Shape, newTopic: Topics.Shape): Promise<boolean> {
    const result = await dbClient
        .update(topics)
        .set(newTopic)
        .where(eq(topics.id, targetTopic.id));

    return result.changes > 0;
}