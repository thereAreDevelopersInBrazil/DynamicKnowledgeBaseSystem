import { Response } from "express";
import { ExpectedError } from "../errors";
import { HTTPSTATUS } from "../constants/http";

export function responseErrorHandler(catchedError: unknown, res: Response) {
    if (catchedError instanceof ExpectedError) {
        res.status(catchedError.status).json({
            error: catchedError.message,
            ...(catchedError.details ? { details: catchedError.details } : {})
        }).end();
        return;
    }
    res.status(HTTPSTATUS.SERVER_ERROR).json({
        error: `Unexpected server error!`,
        details: catchedError
    }).end();
}