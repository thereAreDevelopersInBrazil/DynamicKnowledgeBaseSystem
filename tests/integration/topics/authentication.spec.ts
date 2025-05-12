import request from "supertest";
import server from "../../../src/server";
import { HTTPSTATUS } from "../../../src/constants/http";

describe('Test DELETE /topics route', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be an 401 to call the DELETE TOPICS API without authentication', async () => {
        const response = await request(server).delete('/topics');

        expect(response.statusCode).toEqual(HTTPSTATUS.UNAUTHORIZED);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 401 to call the GET TOPICS API without authentication', async () => {
        const response = await request(server).get('/topics');

        expect(response.statusCode).toEqual(HTTPSTATUS.UNAUTHORIZED);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 401 to call the GET TOPICS PATH API without authentication', async () => {
        const response = await request(server).get('/topics/path');

        expect(response.statusCode).toEqual(HTTPSTATUS.UNAUTHORIZED);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 401 to call the PATCH TOPICS API without authentication', async () => {
        const response = await request(server).patch('/topics');

        expect(response.statusCode).toEqual(HTTPSTATUS.UNAUTHORIZED);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 401 to call the POST TOPICS API without authentication', async () => {
        const response = await request(server).post('/topics');

        expect(response.statusCode).toEqual(HTTPSTATUS.UNAUTHORIZED);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 401 to call the PUT TOPICS API without authentication', async () => {
        const response = await request(server).put('/topics');

        expect(response.statusCode).toEqual(HTTPSTATUS.UNAUTHORIZED);
        expect(response.body).toHaveProperty("error");
    });
});