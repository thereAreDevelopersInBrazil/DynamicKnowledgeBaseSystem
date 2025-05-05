import request from "supertest";
import server from "../../server";
import { HTTPSTATUS } from "../../constants/http";
import { getById } from "../../repositories/topics";
import { VALID_TOPIC } from "../../mocks";
import { buildChildren } from "../../services/topics";

jest.mock('../../repositories/topics', () => ({
    getFirstTopic: jest.fn(),
    getById: jest.fn(),
}));

jest.mock('../../services/topics', () => ({
    buildChildren: jest.fn(),
}));

describe('Test GET /topics route', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be an 404 to call the API with invalid topic id as parameter', async () => {
        (getById as jest.Mock).mockResolvedValue(null);

        const response = await request(server).get('/topics/999');

        expect(response.statusCode).toEqual(HTTPSTATUS.NOT_FOUND);
    });

    it('should be an 500 to call the API and some error happens at repositories', async () => {
        (getById as jest.Mock).mockRejectedValue(new Error("Some error happened"));

        const response = await request(server).get('/topics/999');

        expect(response.statusCode).toEqual(HTTPSTATUS.SERVER_ERROR);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 200 to call the API with valid topic id as parameter', async () => {
        (getById as jest.Mock).mockResolvedValue(VALID_TOPIC);
        (buildChildren as jest.Mock).mockResolvedValue(VALID_TOPIC);

        const response = await request(server).get('/topics/999');

        expect(response.statusCode).toEqual(HTTPSTATUS.OK);
        expect(response.body).toMatchObject(VALID_TOPIC);
    });

});