jest.mock('../../../src/middlewares/authenticator', () => ({
    authenticator: () => (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../../../src/middlewares/roleChecker', () => ({
    roleChecker: () => (_req: any, _res: any, next: any) => next(),
}));

import request from "supertest";
import server from "../../../src/server";
import { HTTPSTATUS } from "../../../src/constants/http";
import { partialUpdateTopic } from "../../../src/services/topics";
import { VALID_RFC6902_PATCH, VALID_TOPIC } from "../../../src/mocks";

jest.mock('../../../src/services/topics', () => ({
    partialUpdateTopic: jest.fn()
}));

describe('Test PATCH /topics route', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be an 400 to call the API without id param', async () => {
        const response = await request(server).patch('/topics');

        expect(response.statusCode).toEqual(HTTPSTATUS.BAD_REQUEST);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 400 to call the API without body following RFC 6902 for body format', async () => {
        const response = await request(server)
                                .patch('/topics/999')
                                .send({
                                    something: "something",
                                    anotherthing: "anotherthing"
                                });

        expect(response.statusCode).toEqual(HTTPSTATUS.BAD_REQUEST);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toHaveLength(3);
    });

    it('should be an 200 to call the API following RFC 6902 for body format ', async () => {
        (partialUpdateTopic as jest.Mock).mockResolvedValue({response:VALID_TOPIC, warnings: []});
        
        const response = await request(server)
                                .patch('/topics/999')
                                .send(VALID_RFC6902_PATCH);

        expect(response.statusCode).toEqual(HTTPSTATUS.OK);
        expect(response.body).toMatchObject(VALID_TOPIC.toJson());
    });

});