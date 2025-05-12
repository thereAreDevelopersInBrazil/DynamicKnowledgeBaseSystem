import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { responseErrorHandler } from '../../utils/requestErrorHandler';
import { findPath } from '../../services/topicsPath';

export const GetPath = async (req: Request, res: Response): Promise<void> => {
    try {
        const path = await findPath(Number(req.query.origin_topic_id), Number(req.query.target_topic_id));
        if (path) {
            res.status(HTTPSTATUS.OK).json(path).end();
        } else {
            res.status(HTTPSTATUS.OK).json({
                info: "Search completed with no errors, but we could not find the path between the topics!"
            }).end();
        }
    } catch (error) {
        responseErrorHandler(error, res);
    }
};

