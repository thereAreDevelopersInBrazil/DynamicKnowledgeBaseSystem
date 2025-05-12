import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { responseErrorHandler } from '../../utils/requestErrorHandler';
import { partialUpdateResource } from '../../services/resources';

export const Patch = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const updated = await partialUpdateResource(id, req.body);
        res.status(HTTPSTATUS.OK).json(updated.toJson()).end();
    } catch (error) {
        responseErrorHandler(error, res);
    }
};