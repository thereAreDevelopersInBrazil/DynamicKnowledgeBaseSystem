jest.mock('../../../src/middlewares/authenticator', () => ({
    authenticator: () => (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../../../src/middlewares/roleChecker', () => ({
    roleChecker: () => (_req: any, _res: any, next: any) => next(),
}));

import request from "supertest";
import server from "../../../src/server";
import { HTTPSTATUS } from "../../../src/constants/http";
import { VALID_TOPIC } from "../../../src/mocks";
import { retrieveAllRootTopics, retrieveAnTopic } from "../../../src/services/topics";
import { ExpectedError } from "../../../src/errors";

jest.mock('../../../src/services/topics', () => ({
    retrieveAnTopic: jest.fn(),
    retrieveAllRootTopics: jest.fn(),
}));

describe('Test GET /topics route', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be an 404 to call the API with invalid topic id as parameter', async () => {
        (retrieveAnTopic as jest.Mock).mockRejectedValue(new ExpectedError(HTTPSTATUS.NOT_FOUND, "Something"));
        const response = await request(server).get('/topics/999');
        expect(response.statusCode).toEqual(HTTPSTATUS.NOT_FOUND);
    });

    it('should be an 500 to call the API and some error happens at repositories', async () => {
        (retrieveAnTopic as jest.Mock).mockRejectedValue(new Error("Some error happened"));

        const response = await request(server).get('/topics/999');

        expect(response.statusCode).toEqual(HTTPSTATUS.SERVER_ERROR);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 200 to call the API with valid topic id as parameter', async () => {
        (retrieveAnTopic as jest.Mock).mockResolvedValue(VALID_TOPIC);

        const response = await request(server).get('/topics/999');

        expect(response.statusCode).toEqual(HTTPSTATUS.OK);
        expect(response.body).toMatchObject(VALID_TOPIC.toJson());
    });

    it('should be an 200 to call the API without topic id as parameter to get ALL topics', async () => {
        (retrieveAllRootTopics as jest.Mock).mockResolvedValue([VALID_TOPIC, VALID_TOPIC]);

        const response = await request(server).get('/topics');

        expect(response.statusCode).toEqual(HTTPSTATUS.OK);
        expect(response.body).toMatchObject([VALID_TOPIC.toJson(), VALID_TOPIC.toJson()]);
    });

});