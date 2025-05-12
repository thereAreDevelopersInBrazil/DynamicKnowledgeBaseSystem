import { NextFunction, Request, Response } from 'express';
import { HTTPSTATUS } from '../constants/http';
import { JWT_SECRET } from '../constants/jwt';
import * as jwt from "jsonwebtoken";
import { ExpectedError } from '../errors';
import { responseErrorHandler } from '../utils/requestErrorHandler';
import { getById } from '../repositories/users';

export const authenticator = () => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const auth = req.headers['authorization'];
    try {
      if (!auth) {
        throw new ExpectedError(HTTPSTATUS.UNAUTHORIZED, 'Unauthorized');
      }

      if (!auth.startsWith('Bearer ')) {
        throw new ExpectedError(HTTPSTATUS.UNAUTHORIZED, 'Unauthorized');
      }

      const token = auth.split(' ')[1];

      const decoded = jwt.verify(token, JWT_SECRET);

      if (typeof decoded == 'string') {
        throw new ExpectedError(HTTPSTATUS.UNAUTHORIZED, 'Unauthorized');
      }

      if (decoded?.id) {
        // I know that this will run an database query each request
        // There is another ways to to that
        // But I think for this challenge purposes its ok
        const user = await getById(decoded.id);
        if (!user) {
          throw new ExpectedError(HTTPSTATUS.UNAUTHORIZED, 'Unauthorized');
        }
        req.user = user;
        next();
      }
    } catch (error) {
      let expected: ExpectedError | null = null;
      // If I dont do this it will fall as an 500 error in my responseErrorHandler
      // @ts-expect-error - Will use name just if it exists
      if (error?.name && error.name == 'TokenExpiredError') {
        expected = new ExpectedError(HTTPSTATUS.UNAUTHORIZED, 'Token Expired')
      }
      responseErrorHandler(expected ? expected : error, res);
    }
  };
};
