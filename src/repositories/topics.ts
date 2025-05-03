import { dbClient } from '../database/client';
import { topics } from '../database/schema';
import { Topic } from '../entities/topics';
import { asc, eq } from 'drizzle-orm';
import { Topics } from '../schemas';

export async function insert(topic: Topic): Promise<number> {
    const response = await dbClient.insert(topics).values({
        name: topic.getName(),
        content: topic.getContent(),
        parentTopicId: topic.getParentTopicId()
    });

    return Number(response.lastInsertRowid);
}
export async function getFirstTopic(): Promise<Topics.Shape | null> {
    const result = await dbClient.select().from(topics).orderBy(asc(topics.id)).limit(1);
    return result[0] ? result[0] : null;
}
export async function getById(id: number): Promise<Topics.Shape | null> {
    const [result] = await dbClient.select().from(topics).where(eq(topics.id, id));

    return result;
}

export async function getAll(): Promise<Topics.Shape[] | null> {
    return await dbClient.select().from(topics);
}

export async function getChildren(id: number): Promise<Topics.Shape[]> {
    return await dbClient.select().from(topics).where(eq(topics.parentTopicId, id));
}