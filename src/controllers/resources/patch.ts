import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';

export const Patch = (req: Request, res: Response) => {
    res.status(HTTPSTATUS.OK).send("Patching Resources").end();
};