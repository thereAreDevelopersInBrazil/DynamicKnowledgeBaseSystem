import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { responseErrorHandler } from '../../utils/requestErrorHandler';
import { deleteResource } from '../../services/resources';

export const Delete = async (req: Request, res: Response) => {
    try {
        const isDeleted = await deleteResource(Number(req.params.id));
        res.status(HTTPSTATUS.OK).json({
            deleted: isDeleted
        }).end();
    } catch (error) {
        responseErrorHandler(error, res);
    }
};

