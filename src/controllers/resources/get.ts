import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { responseErrorHandler } from '../../utils/requestErrorHandler';
import { retrieveAnResource, retrieveResources } from '../../services/resources';

export const Get = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params?.id);
        if (!isNaN(id)) {
            const resource = await retrieveAnResource(id);
            res.status(HTTPSTATUS.OK).json(resource.toJson()).end();
        } else {
            const resources = await retrieveResources();
            const resourcesJson = resources.map((resource) => {
                return resource.toJson()
            });
            res.status(HTTPSTATUS.OK).json(resourcesJson).end();
        }
    } catch (error) {
        responseErrorHandler(error, res);
    }
};

