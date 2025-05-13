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
            parentTopicId: req.body.parentTopicId,
            resources: req.body.resources
        }
        const toUpdate = new Topic(props);
        const response = await fullUpdateTopic(id, toUpdate, req.body.resources);
        const updatedTopic = response.response as Topic;
        if (response.warnings.length > 0) {
            res.status(HTTPSTATUS.OK).json({
                ...updatedTopic.toJson(),
                warnings: response.warnings
            }).end();
        } else {
            res.status(HTTPSTATUS.OK).json(updatedTopic.toJson()).end();
        }
    } catch (error) {
        responseErrorHandler(error, res);
    }
};