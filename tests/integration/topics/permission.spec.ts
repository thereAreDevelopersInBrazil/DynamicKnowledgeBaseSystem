jest.mock('../../../src/middlewares/authenticator', () => ({
    authenticator: () => (_req: any, _res: any, next: any) => next(),
}));

import request from "supertest";
import server from "../../../src/server";
import { HTTPSTATUS } from "../../../src/constants/http";

describe('Test DELETE /topics route', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be an 401 to call the DELETE TOPICS API with no permissions', async () => {
        const response = await request(server).delete('/topics');

        expect(response.statusCode).toEqual(HTTPSTATUS.FORBIDDEN);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 401 to call the GET TOPICS API with no permissions', async () => {
        const response = await request(server).get('/topics');

        expect(response.statusCode).toEqual(HTTPSTATUS.FORBIDDEN);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 401 to call the GET TOPICS PATH API with no permissions', async () => {
        const response = await request(server).get('/topics/path');

        expect(response.statusCode).toEqual(HTTPSTATUS.FORBIDDEN);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 401 to call the PATCH TOPICS API with no permissions', async () => {
        const response = await request(server).patch('/topics');

        expect(response.statusCode).toEqual(HTTPSTATUS.FORBIDDEN);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 401 to call the POST TOPICS API with no permissions', async () => {
        const response = await request(server).post('/topics');

        expect(response.statusCode).toEqual(HTTPSTATUS.FORBIDDEN);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 401 to call the PUT TOPICS API with no permissions', async () => {
        const response = await request(server).put('/topics');

        expect(response.statusCode).toEqual(HTTPSTATUS.FORBIDDEN);
        expect(response.body).toHaveProperty("error");
    });
});