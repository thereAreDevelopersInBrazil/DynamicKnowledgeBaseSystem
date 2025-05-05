import request from "supertest";
import server from "../../server";
import { HTTPSTATUS } from "../../constants/http";
import { fullUpdateTopic } from "../../services/topics";
import { VALID_TOPIC } from "../../mocks";

jest.mock('../../services/topics', () => ({
    fullUpdateTopic: jest.fn(),
}));

describe('Test PUT /topics route', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be an 400 to call the API without id param', async () => {
        const response = await request(server).put('/topics');

        expect(response.statusCode).toEqual(HTTPSTATUS.BAD_REQUEST);
        expect(response.body).toHaveProperty("error");
    });


    it('should be an 400 with 2 errors to call the API with empty body', async () => {
        const response = await request(server)
            .put('/topics/999')
            .send({});

        expect(response.statusCode).toEqual(HTTPSTATUS.BAD_REQUEST);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toHaveLength(2);
    });

    it('should be an 500 if error happens when updating the topic', async () => {
        (fullUpdateTopic as jest.Mock).mockRejectedValue(new Error("Something"));

        const response = await request(server)
            .put('/topics/999')
            .send(VALID_TOPIC);

        expect(response.statusCode).toEqual(HTTPSTATUS.SERVER_ERROR);
        expect(response.body).toHaveProperty("error");
    });

    it('should be an 200 if everything goes well', async () => {
        (fullUpdateTopic as jest.Mock).mockResolvedValue(VALID_TOPIC);

        const response = await request(server)
            .put('/topics/999')
            .send(VALID_TOPIC);

        expect(response.statusCode).toEqual(HTTPSTATUS.OK);
        expect(response.body).toMatchObject(VALID_TOPIC);
    });

});