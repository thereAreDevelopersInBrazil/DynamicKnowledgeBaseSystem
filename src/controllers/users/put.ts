import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { responseErrorHandler } from '../../utils/requestErrorHandler';
import { fullUpdateUser } from '../../services/users';
import { getById } from '../../repositories/users';
import { ExpectedError } from '../../errors';

export const Put = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const user = await getById(id);
        if (!user) {
            throw new ExpectedError(HTTPSTATUS.NOT_FOUND, `There are no users with id ${id} to be updated!`);
        }
        user.setName(req.body.name);
        user.setEmail(req.body.email);
        user.setPassword(req.body.password);
        user.setRole(req.body.role);
        const updated = await fullUpdateUser(id, user);
        res.status(HTTPSTATUS.OK).json(updated.toJson()).end();
    } catch (error) {
        responseErrorHandler(error, res);
    }
};