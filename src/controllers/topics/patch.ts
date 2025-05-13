import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { responseErrorHandler } from '../../utils/requestErrorHandler';
import { partialUpdateTopic } from '../../services/topics';
import { Topic } from '../../entities/topics';

export const Patch = async (req: Request, res: Response) => {
    try {
        const response = await partialUpdateTopic(Number(req.params.id), req.body);
        const topic = response.response as Topic;
        if (response.warnings.length > 0) {
            res.status(HTTPSTATUS.OK).json({
                ...topic.toJson(),
                warnings: response.warnings
            }).end();
        } else {
            res.status(HTTPSTATUS.OK).json(topic.toJson()).end();
        }
    } catch (error) {
        responseErrorHandler(error, res);
    }
};