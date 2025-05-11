import { Response } from "express";
import { ExpectedError } from "../errors";
import { HTTPSTATUS } from "../constants/http";

export function responseErrorHandler(error: unknown, res: Response) {
    if (error instanceof ExpectedError) {
        res.status(error.status).json({
            error: error.message,
            ...(error.details ? { details: error.details } : {})
        }).end();
        return;
    }
    res.status(HTTPSTATUS.SERVER_ERROR).json({
        error: `Unexpected server error!`,
        details: error
    }).end();
}