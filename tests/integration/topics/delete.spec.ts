jest.mock('../../../src/middlewares/authenticator', () => ({
    authenticator: () => (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../../../src/middlewares/roleChecker', () => ({
    roleChecker: () => (_req: any, _res: any, next: any) => next(),
}));

import request from "supertest";
import server from "../../../src/server";
import { HTTPSTATUS } from "../../../src/constants/http";
import { deleteTopic } from "../../../src/services/topics";

jest.mock('../../../src/services/topics', () => ({
    deleteTopic: jest.fn()
}));

describe('Test DELETE /topics route', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be an 400 to call the API without id parameter', async () => {
        const response = await request(server).delete('/topics');

        expect(response.statusCode).toEqual(HTTPSTATUS.BAD_REQUEST);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 200 to call the API with valid id parameter', async () => {
        (deleteTopic as jest.Mock).mockResolvedValue(true);

        const response = await request(server).delete('/topics/17');

        expect(response.statusCode).toEqual(HTTPSTATUS.OK);
        expect(response.body).toEqual({
            deleted: true
        });
    });

});