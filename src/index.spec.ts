import request from "supertest";
import server from "./server";
import { HTTPSTATUS } from "./constants/http";

describe('Test server basic routes', () => {
    it('should test GET / to respond with status 404', async () => {
        const response = await request(server).get('/');

        expect(response.statusCode).toEqual(HTTPSTATUS.NOT_FOUND);
    });

    it('should test GET /healthcheck to respond with status 200', async () => {
        const response = await request(server).get('/healthcheck');

        expect(response.statusCode).toEqual(HTTPSTATUS.OK);
    });
});