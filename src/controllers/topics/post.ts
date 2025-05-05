import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { Topic } from '../../entities/topics';
import { createTopic, getTopicWithParentsById } from '../../services/topics';

export const Post = async (req: Request, res: Response) => {
    try {
        const topic = new Topic(req.body);
        const insertedId = await createTopic(topic);

        /**
         * It was not specified by the challenge but while programming and
         * debbuging I thought it would be helpful to return parents nested
         * after a insertion
         */
        const insertedTopicWithNestedParents = await getTopicWithParentsById(Number(insertedId));
        if (insertedTopicWithNestedParents) {
            res.status(HTTPSTATUS.OK).json(insertedTopicWithNestedParents).end();
        }
    } catch (error) {
        res.status(HTTPSTATUS.SERVER_ERROR).json({
            error: 'Unexpected error while creating topic!',
            details: error
        }).end();
    }
};