import { dbClient } from '../database/client';
import { topics_versions } from '../database/schema';
import { Topic } from '../entities/topics';
import { eq, sql } from 'drizzle-orm';

export async function storeVersion(topic: Topic): Promise<number> {
    const result = await dbClient
        .insert(topics_versions)
        .values({
            topicId: topic.getId(),
            name: topic.getName(),
            content: topic.getContent(),
            parentTopicId: topic.getParentTopicId(),
            version: topic.getVersion(),
            createdAt: topic.getCreatedAt(),
            updatedAt: topic.getUpdatedAt(),
        });

    return Number(result.lastInsertRowid);
}

export async function getNumberOfPreviousVersions(id: number): Promise<number> {
    const result = await dbClient
        .select({ count: sql`count(*)`.mapWith(Number) }).from(topics_versions)
        .where(eq(topics_versions.topicId, id));
    return result[0] ? result[0].count : 0;
}