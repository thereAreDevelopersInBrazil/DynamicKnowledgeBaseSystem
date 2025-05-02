import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';

export const Get = (req: Request, res: Response) => {
    res.status(HTTPSTATUS.OK).send("Getting Users").end();
};

