import { dbClient } from '../database/client';
import { resources_topics } from '../database/schema';
import { and, eq } from 'drizzle-orm';
import { ExpectedError } from '../errors';
import { HTTPSTATUS } from '../constants/http';

export async function attach(resourceId: number, topicId: number): Promise<number> {

    const result = await dbClient.insert(resources_topics).values({
        resourceId: resourceId,
        topicId: topicId
    });

    if (!result || !result.lastInsertRowid) {
        throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, 'Unexpected error while attaching the resource to the topic!');
    }

    return Number(result.lastInsertRowid);
}

export async function detach(resourceId: number, topicId: number): Promise<number> {

    const result = await dbClient.delete(resources_topics).where(
        and(
            eq(resources_topics.resourceId, resourceId),
            eq(resources_topics.topicId, topicId)
        )
    );

    if (!result || !result.lastInsertRowid) {
        throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, 'Unexpected error while detaching the resource to the topic!');
    }

    return Number(result.lastInsertRowid);
}