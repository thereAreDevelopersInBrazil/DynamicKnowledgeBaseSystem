import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { Topic } from '../../entities/topics';
import { createTopic } from '../../services/topics';
import { buildParents } from '../../factories/topics';
import { responseErrorHandler } from '../../utils/requestErrorHandler';
import { ExpectedError } from '../../errors';

export const Post = async (req: Request, res: Response) => {
    try {
        const newTopic = new Topic(req.body);
        const response = await createTopic(newTopic, req.body.resources);

        if (!response.response) {
            throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Error while creating new topic! Unable to detect the created topic!");
        }
        /**
         * It was not specified by the challenge but while programming and
         * debbuging I thought it would be helpful to return parents nested
         * after a insertion
         */
        const createdTopicWithNestedParents = await buildParents(response.response as Topic);
        if (createdTopicWithNestedParents) {
            if (response.warnings.length > 0) {
                res.status(HTTPSTATUS.OK).json({
                    ...createdTopicWithNestedParents.toJson(),
                    warnings: response.warnings
                }).end();
            } else {
                res.status(HTTPSTATUS.OK).json(createdTopicWithNestedParents.toJson()).end();
            }
        }
    } catch (error) {
        responseErrorHandler(error, res);
    }
};