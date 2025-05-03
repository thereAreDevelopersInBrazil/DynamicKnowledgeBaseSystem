import { and, asc, eq, ne } from 'drizzle-orm';
import { dbClient } from '../database/client';
import { topics, topics_tree } from '../database/schema';
import { Topic } from '../entities/topics';
import { getTopicTreeById } from '../services/topics';
import { Topics } from '../schemas';

export async function insert(topicId: number): Promise<void> {
    const topicTree = await getTopicTreeById(topicId);
    topicTree.reverse();
    for (let i = 0; i < topicTree.length; i++) {
        await dbClient.insert(topics_tree).values({
            topicId: topicId,
            position: i,
            nodeTopicId: topicTree[i],
        });
    }
}

export async function getTopicsBellow(topic: Topic): Promise<Topics.Shape[]> {
    const result = await dbClient
        .select({
            id: topics.id,
            name: topics.name,
            content: topics.content,
            version: topics.version,
            parentTopicId: topics.parentTopicId,
            createdAt: topics.createdAt,
            updatedAt: topics.updatedAt,
        })
        .from(topics_tree)
        .innerJoin(topics, eq(topics_tree.topicId, topics.id))
        .where(
            and(
                eq(topics_tree.nodeTopicId, topic.getId()),
                ne(topics_tree.topicId, topic.getId())
            )
        )
        .orderBy(asc(topics.id));

    return result;
}