import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { Topic } from '../../entities/topics';
import { createTopic } from '../../services/topics';
import { buildParents } from '../../factories/topics';
import { responseErrorHandler } from '../../utils/requestErrorHandler';

export const Post = async (req: Request, res: Response) => {
    try {
        const newTopic = new Topic(req.body);
        const createdTopic = await createTopic(newTopic);
        /**
         * It was not specified by the challenge but while programming and
         * debbuging I thought it would be helpful to return parents nested
         * after a insertion
         */
        const createdTopicWithNestedParents = await buildParents(createdTopic);
        if (createdTopicWithNestedParents) {
            res.status(HTTPSTATUS.OK).json(createdTopicWithNestedParents.toJson()).end();
        }
    } catch (error) {
        responseErrorHandler(error, res);
    }
};