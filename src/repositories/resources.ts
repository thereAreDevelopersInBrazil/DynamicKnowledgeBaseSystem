import { dbClient } from '../database/client';
import { resources, resources_topics } from '../database/schema';
import { and, eq, ne } from 'drizzle-orm';
import { ExpectedError } from '../errors';
import { HTTPSTATUS } from '../constants/http';
import { Resources } from '../schemas';
import { PatchPossibleValues } from '../schemas/abstracts';
import { AResource } from '../entities/resources/AResource';
import { buildResource } from '../factories/resources';

export async function insert(resource: AResource<Resources.Types>): Promise<number> {

    const result = await dbClient.insert(resources).values({
        url: resource.getUrl(),
        description: resource.getDescription(),
        type: resource.getType(),
        details: resource.getDetails()
    });

    if (!result || !result.lastInsertRowid) {
        throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, 'Unexpected error while detecting the created resource data!');
    }

    return Number(result.lastInsertRowid);
}

export async function getAll(): Promise<AResource<Resources.Types>[]> {
    const result = await dbClient.select()
        .from(resources)
        .where(
            and(
                eq(resources.isDeleted, false),
            )
        );

    if (!result) {
        return [];
    }

    const entities: AResource<Resources.Types>[] = result.map((result: Resources.Shape<Resources.Types>) => {
        return buildResource(result)
    });

    return entities;
}

export async function getById(id: number): Promise<AResource<Resources.Types> | null> {
    const [result] = await dbClient.select()
        .from(resources)
        .where(
            and(
                eq(resources.isDeleted, false),
                eq(resources.id, id)
            )
        );

    if (!result) {
        return null;
    }

    return buildResource(result);
}

export async function getByUrl(url: string, exclude: number | null = null): Promise<AResource<Resources.Types> | null> {
    const [result] = await dbClient.select()
        .from(resources)
        .where(
            and(
                eq(resources.isDeleted, false),
                eq(resources.url, url),
                exclude ? ne(resources.id, exclude) : undefined
            )
        );

    if (!result) {
        return null;
    }

    return buildResource(result);
}
export async function getResourcesByTopicId(id: number) {
    const result = await dbClient.select({
        id: resources.id,
        url: resources.url,
        description: resources.description,
        type: resources.type,
        details: resources.details
    })
        .from(resources)
        .innerJoin(resources_topics, eq(resources.id, resources_topics.resourceId))
        .where(
            and(
                eq(resources_topics.topicId, id),
                eq(resources.isDeleted, false)
            )
        );

    if (!result) {
        return [];
    }

    const entities: AResource<Resources.Types>[] = result.map((result: Resources.Shape<Resources.Types>) => {
        return buildResource(result)
    });

    return entities;
}
export async function update(id: number, entity: AResource<Resources.Types>): Promise<boolean> {
    const result = await dbClient
        .update(resources)
        .set({
            url: entity.getUrl(),
            description: entity.getDescription(),
            type: entity.getType(),
            details: entity.getDetails()
        })
        .where(eq(resources.id, id));

    return result.changes > 0;
}

export async function updateSingleProperty(id: number, prop: string, value: PatchPossibleValues): Promise<boolean> {
    const result = await dbClient
        .update(resources)
        .set({ [prop]: value })
        .where(eq(resources.id, id));

    return result.changes > 0;
}


export async function logicalDeletion(id: number): Promise<boolean> {
    const result = await dbClient
        .update(resources)
        .set({ isDeleted: true })
        .where(eq(resources.id, id));

    return result.changes > 0;
}