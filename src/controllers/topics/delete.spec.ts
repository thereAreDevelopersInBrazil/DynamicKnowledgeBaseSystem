import request from "supertest";
import server from "../../server";
import { HTTPSTATUS } from "../../constants/http";
import { logicalDeletion } from "../../repositories/topics";

jest.mock('../../repositories/topics', () => ({
    logicalDeletion: jest.fn()
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
        (logicalDeletion as jest.Mock).mockResolvedValue(undefined);

        const response = await request(server).delete('/topics/17');

        expect(response.statusCode).toEqual(HTTPSTATUS.OK);
        expect(response.body).toEqual({});
    });

});