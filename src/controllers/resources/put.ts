import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { responseErrorHandler } from '../../utils/requestErrorHandler';
import { Resources } from '../../schemas';
import { buildResource } from '../../factories/resources';
import { fullUpdateResource } from '../../services/resources';

export const Put = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const props: Resources.Shape = {
            id: 0,
            url: req.body.url,
            description: req.body.description,
            type: req.body.type,
            details: req.body.details
        }
        const toUpdate = buildResource(props);
        const updated = await fullUpdateResource(id, toUpdate);
        res.status(HTTPSTATUS.OK).json(updated.toJson()).end();
    } catch (error) {
        responseErrorHandler(error, res);
    }
};