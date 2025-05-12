import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { responseErrorHandler } from '../../utils/requestErrorHandler';
import { Topic } from '../../entities/topics';
import { Topics } from '../../schemas';
import { fullUpdateTopic } from '../../services/topics';

export const Put = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const props: Topics.Shape = {
            id: 0,
            name: req.body.name,
            content: req.body.content,
            parentTopicId: req.body.parentTopicId
        }
        const toUpdate = new Topic(props);
        const updated = await fullUpdateTopic(id, toUpdate);
        res.status(HTTPSTATUS.OK).json(updated.toJson()).end();
    } catch (error) {
        responseErrorHandler(error, res);
    }
};