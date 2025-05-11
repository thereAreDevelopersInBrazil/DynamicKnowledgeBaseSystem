import { NextFunction, Request, Response } from 'express';
import { HTTPSTATUS } from '../constants/http';
import { Permissions } from '../types';

export const roleChecker = (action: Permissions) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if(!req.user?.hasPermission(action)){
      res.status(HTTPSTATUS.FORBIDDEN).json({
        error: `Your user currently does not have permissions to ${action.replace("_", " ")}.`
      }).end();
    }else{
      next();
    }
  }
};
