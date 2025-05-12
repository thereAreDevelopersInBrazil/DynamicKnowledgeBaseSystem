import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { responseErrorHandler } from '../../utils/requestErrorHandler';
import { buildResource } from '../../factories/resources';
import { createResource } from '../../services/resources';

export const Post = async (req: Request, res: Response) => {
    try {
        const resource = buildResource(req.body);
        const created = await createResource(resource);
        res.status(HTTPSTATUS.OK).json(created.toJson()).end();
    } catch (error) {
        responseErrorHandler(error, res);
    }
};