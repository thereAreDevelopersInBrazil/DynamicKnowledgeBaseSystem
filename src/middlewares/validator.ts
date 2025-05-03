import { NextFunction, Request, Response } from 'express';
import { ZodSchema, ZodError, ZodIssueCode, ZodIssue } from 'zod';
import { HTTPSTATUS } from '../constants/http';

export const validator = (schema: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const allErrors: {
      field: string;
      message: string;
      expected?: string;
      received?: string;
    }[] = [];

    const validate = (source: 'body' | 'query' | 'params', data: unknown, zodSchema?: ZodSchema) => {
      if (!zodSchema) return;
      try {
        zodSchema.parse(data);
      } catch (err) {
        if (err instanceof ZodError) {
          err.errors.forEach((issue: ZodIssue) => {
            const error: {
              field: string;
              message: string;
              expected?: string;
              received?: string;
            } = {
              field: issue.path.length > 0 ? `${source}.${issue.path.join('.')}` : source,
              message: issue.message
            };

            if (issue.code === ZodIssueCode.invalid_type) {
              error.expected = issue.expected;
              error.received = issue.received;
            }

            allErrors.push(error);
          });
        } else {
          allErrors.push({
            field: source,
            message: 'Invalid data'
          });
        }
      }
    };

    validate('body', req.body, schema.body);
    validate('query', req.query, schema.query);
    validate('params', req.params, schema.params);

    if (allErrors.length > 0) {
      res.status(HTTPSTATUS.BAD_REQUEST).json({ errors: allErrors });
    }

    next();
  };
};
