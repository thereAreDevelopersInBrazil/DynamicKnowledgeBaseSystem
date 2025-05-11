import { Request, Response } from 'express';
import { login } from '../../services/login';
import { responseErrorHandler } from '../../utils/requestErrorHandler';
import { HTTPSTATUS } from '../../constants/http';

export const PostLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const token = await login(email, password);
        res.status(HTTPSTATUS.OK).json({ token }).end();
    } catch (error) {
        responseErrorHandler(error, res);
    }
};