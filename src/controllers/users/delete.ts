import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { deleteUser } from '../../services/users';
import { responseErrorHandler } from '../../utils/requestErrorHandler';

export const Delete = async (req: Request, res: Response) => {
    try {
        const isDeleted = await deleteUser(Number(req.params.id));
        res.status(HTTPSTATUS.OK).json({
            deleted: isDeleted
        }).end();
    } catch (error) {
        responseErrorHandler(error, res);
    }
};

