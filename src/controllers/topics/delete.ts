import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { logicalDeletion } from '../../repositories/topics';

export const Delete = async (req: Request, res: Response) => {
    try {
        await logicalDeletion(Number(req.params.id));
        res.status(HTTPSTATUS.OK).end();
    } catch (error) {
        res.status(HTTPSTATUS.SERVER_ERROR).json({
            error: `Error while deleting, please try again later! Details: ${error}`
        }).end();
    }
};

