import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { createUser } from '../../services/users';
import { responseErrorHandler } from '../../utils/requestErrorHandler';
import { buildUser } from '../../factories/users';

export const Post = async (req: Request, res: Response) => {
    try {
        const user = buildUser(req.body);
        
        const created = await createUser(user);
        res.status(HTTPSTATUS.OK).json(created.toJson()).end();
    } catch (error) {
        responseErrorHandler(error, res);
    }
};