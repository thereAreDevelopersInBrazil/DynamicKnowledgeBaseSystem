import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { partialUpdateTopic } from '../../services/topics';
import { ExpectedError } from '../../errors';

export const Patch = async (req: Request, res: Response) => {
    try {
        const result = await partialUpdateTopic(Number(req.params.id), req.body);
        res.status(HTTPSTATUS.OK).json(result).end();
    } catch (error) {
        if (error instanceof ExpectedError) {
            res.status(error.status).json({
                error: error.message,
                ...(error.details ? { details: error.details } : {})
            })
        }
        res.status(HTTPSTATUS.SERVER_ERROR).json({
            error: `Unexpected error while patching the topic!`,
            details: error
        }).end();
    }
};