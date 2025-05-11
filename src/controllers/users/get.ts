import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../constants/http';
import { retrieveAnUser, retrieveUsers } from '../../services/users';
import { responseErrorHandler } from '../../utils/requestErrorHandler';

export const Get = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params?.id);
        if (!isNaN(id)) {
            const user = await retrieveAnUser(id);
            res.status(HTTPSTATUS.OK).json(user.toJson()).end();
        } else {
            const users = await retrieveUsers();
            const usersJson = users.map((user) => {
                return user.toJson()
            });
            res.status(HTTPSTATUS.OK).json(usersJson).end();
        }
    } catch (error) {
        responseErrorHandler(error, res);
    }
};

