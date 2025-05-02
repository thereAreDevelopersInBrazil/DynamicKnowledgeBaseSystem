import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';

export const Delete = (req: Request, res: Response) => {
    res.status(HTTPSTATUS.OK).send("Deleting Topics").end();
};

