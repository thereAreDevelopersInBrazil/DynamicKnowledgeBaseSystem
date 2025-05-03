import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { getById, getFirstTopic } from '../../repositories/topics';
import { buildChildren } from '../../services/topics';

export const Get = async (req: Request, res: Response): Promise<void> => {
    try {

        const idToSearch = Number(req.params.id);

        // My intention here is to be less restrict with users
        // and avoid API error 400 if not specified and id to search
        // So, if its not specified I will get all topics from the root topic (earliest topic in database)
        const topicResult = !idToSearch ? await getFirstTopic() : await getById(idToSearch);

        if (!topicResult) {
            // I think that if there is no first topic at all, the database is empty
            // Nothing to show dosent mean its an 404 or 400, just there isnt nothing to show
            if (!idToSearch) {
                res.status(HTTPSTATUS.OK).json([]).end();
                return;
            }

            // The user specified an given ID in the URL
            // And this case this ID dosent exists on database
            // So i could not help, its an 404
            res.status(HTTPSTATUS.NOT_FOUND).send("There is no topic with the given ID " + idToSearch).end();
            return;
        }

        const topicsWithChildren = await buildChildren(topicResult);
        if (topicsWithChildren) {
            res.status(HTTPSTATUS.OK).json(topicsWithChildren).end();
        } else {
            res.status(HTTPSTATUS.NOT_FOUND).send('Topic id: ' + idToSearch + ' not found!').end();
        }
        return;
    } catch (error) {
        res.status(HTTPSTATUS.SERVER_ERROR).send("Error retrieving topic with children! Details: " + error).end();
    }
    return;
};

