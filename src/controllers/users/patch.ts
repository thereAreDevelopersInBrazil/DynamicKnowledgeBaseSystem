import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { partialUpdateUser } from '../../services/users';
import { responseErrorHandler } from '../../utils/requestErrorHandler';

export const Patch = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const updated = await partialUpdateUser(id, req.body);
        res.status(HTTPSTATUS.OK).json(updated.toJson()).end();
    } catch (error) {
        responseErrorHandler(error, res);
    }
};