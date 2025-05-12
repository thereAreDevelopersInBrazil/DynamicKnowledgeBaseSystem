import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { responseErrorHandler } from '../../utils/requestErrorHandler';
import { retrieveAnTopic, retrieveAllRootTopics } from '../../services/topics';
import { Topic } from '../../entities/topics';

export const Get = async (req: Request, res: Response): Promise<void> => {
    try {

        const id = Number(req.params.id);
        const version = req.query.version ? Number(req.query.version) : null;

        if (!isNaN(id)) {
            const topic = await retrieveAnTopic(id, version);
            res.status(HTTPSTATUS.OK).json(topic.toJson()).end();
        } else {
            const topics = await retrieveAllRootTopics();
            res.status(HTTPSTATUS.OK).json(topics.map((topic: Topic) => { return topic.toJson() })).end();
        }
    } catch (error) {
        responseErrorHandler(error, res);
    }
};

