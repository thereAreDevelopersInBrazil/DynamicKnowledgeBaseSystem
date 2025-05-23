import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { responseErrorHandler } from '../../utils/requestErrorHandler';
import { deleteTopic } from '../../services/topics';

export const Delete = async (req: Request, res: Response) => {
    try {
        const isDeleted = await deleteTopic(Number(req.params.id));
        res.status(HTTPSTATUS.OK).json({
            deleted: isDeleted
        }).end();
    } catch (error) {
        responseErrorHandler(error, res);
    }
};

