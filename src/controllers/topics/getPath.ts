import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { findShortestPathBetweenTopics } from '../../services/topics';

export const GetPath = async (req: Request, res: Response): Promise<void> => {
    try {
        const path = await findShortestPathBetweenTopics(Number(req.query.origin_topic_id), Number(req.query.target_topic_id));
        if (path) {
            res.status(HTTPSTATUS.OK).json(path).end();
        }else{
            res.status(HTTPSTATUS.OK).json({
                info: "Search completed with no errors, but we could not find the path between the topics!"
            }).end();
        }
    } catch (error) {
        res.status(HTTPSTATUS.SERVER_ERROR).json({
            error: "Error retrieving topic with children! Details: " + error
        }).end();
    }
    return;
};

