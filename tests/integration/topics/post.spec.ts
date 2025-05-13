jest.mock('../../../src/middlewares/authenticator', () => ({
    authenticator: () => (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../../../src/middlewares/roleChecker', () => ({
    roleChecker: () => (_req: any, _res: any, next: any) => next(),
}));

import request from "supertest";
import server from "../../../src/server";
import { HTTPSTATUS } from "../../../src/constants/http";
import { createTopic } from "../../../src/services/topics";
import { VALID_TOPIC } from "../../../src/mocks";

jest.mock('../../../src/services/topics', () => ({
    createTopic: jest.fn(),
}));

describe('Test POST /topics route', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be an 400 with 2 errors to call the API with empty body', async () => {
        const response = await request(server)
            .post('/topics')
            .send({});

        expect(response.statusCode).toEqual(HTTPSTATUS.BAD_REQUEST);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toHaveLength(2);
    });

    it('should be an 500 if error happens when creating the topic', async () => {
        (createTopic as jest.Mock).mockRejectedValue(new Error("Something"));

        const response = await request(server)
            .post('/topics')
            .send(VALID_TOPIC.toJson());

        expect(response.statusCode).toEqual(HTTPSTATUS.SERVER_ERROR);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 200 if everything goes well', async () => {
        (createTopic as jest.Mock).mockResolvedValue({response:VALID_TOPIC, warnings: []});

        const response = await request(server)
            .post('/topics')
            .send(VALID_TOPIC.toJson());

        expect(response.statusCode).toEqual(HTTPSTATUS.OK);
        expect(response.body).toMatchObject(VALID_TOPIC.toJson());
    });

});