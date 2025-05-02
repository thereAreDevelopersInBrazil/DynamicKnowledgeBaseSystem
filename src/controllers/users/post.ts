import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';

export const Post = (req: Request, res: Response) => {
    res.status(HTTPSTATUS.OK).send("Posting Users").end();
};