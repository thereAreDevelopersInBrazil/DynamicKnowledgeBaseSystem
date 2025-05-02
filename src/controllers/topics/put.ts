import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';

export const Put = (req: Request, res: Response) => {
    res.status(HTTPSTATUS.OK).send("Putting Topics").end();
};