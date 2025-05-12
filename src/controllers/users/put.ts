import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { responseErrorHandler } from '../../utils/requestErrorHandler';
import { fullUpdateUser } from '../../services/users';
import { Users } from '../../schemas';
import { buildUser } from '../../factories/users';

export const Put = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const props: Users.Shape = {
            id: 0,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        }
        const toUpdate = buildUser(props);
        const updated = await fullUpdateUser(id, toUpdate);
        res.status(HTTPSTATUS.OK).json(updated.toJson()).end();
    } catch (error) {
        responseErrorHandler(error, res);
    }
};