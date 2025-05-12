jest.mock('../../../src/middlewares/authenticator', () => ({
    authenticator: () => (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../../../src/middlewares/roleChecker', () => ({
    roleChecker: () => (_req: any, _res: any, next: any) => next(),
}));

import request from "supertest";
import server from "../../../src/server";
import { HTTPSTATUS } from "../../../src/constants/http";
import { findPath } from "../../../src/services/topicsPath";
import { VALID_PATH } from "../../../src/mocks";

jest.mock('../../../src/services/topicsPath', () => ({
    findPath: jest.fn(),
}));

describe('Test GET /topics/path route', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be an 400 if querystring origin_topic_id is not sent', async () => {

        const response = await request(server).get('/topics/path?origin_topic_id=&target_topic_id=999');

        expect(response.statusCode).toEqual(HTTPSTATUS.BAD_REQUEST);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 400 if querystring target_topic_id is not sent', async () => {

        const response = await request(server).get('/topics/path?origin_topic_id=999&target_topic_id=');

        expect(response.statusCode).toEqual(HTTPSTATUS.BAD_REQUEST);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 500 if some error happens during the search', async () => {
        (findPath as jest.Mock).mockRejectedValue(new Error("Some error"));

        const response = await request(server).get('/topics/path?origin_topic_id=999&target_topic_id=999');

        expect(response.statusCode).toEqual(HTTPSTATUS.SERVER_ERROR);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 200 if find the path between the topics', async () => {
        (findPath as jest.Mock).mockResolvedValue(VALID_PATH);
        const response = await request(server).get('/topics/path?origin_topic_id=999&target_topic_id=999');

        expect(response.statusCode).toEqual(HTTPSTATUS.OK);
        expect(response.body).toMatchObject(VALID_PATH);
    });

    it('should be an 200 if does not find the path between the topics (But will never happen if topics exists!)', async () => {
        (findPath as jest.Mock).mockResolvedValue(false);
        const response = await request(server).get('/topics/path?origin_topic_id=999&target_topic_id=999');

        expect(response.statusCode).toEqual(HTTPSTATUS.OK);
        expect(response.body).toHaveProperty("info");
    });

});