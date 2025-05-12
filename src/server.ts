import express from 'express';
import { HTTPSTATUS } from './constants/http';

// Always when I see myself repeating code I start thinking in automations
// @TODO: Automatize all the routing system
import usersRoutes from './routes/users';
import topicsRoutes from './routes/topics';
import resourcesRoutes from './routes/resources';

const server = express();

server.get('/', (_, res) => {
    res.status(HTTPSTATUS.NOT_FOUND).end();
});

server.get('/healthcheck', (_, res) => {
    res.status(HTTPSTATUS.OK).end();
});

server.use(express.json());

// Always when I see myself repeating code I start thinking in automations
// @TODO: Automatize all the routing system

server.use('/users', usersRoutes);
server.use('/topics', topicsRoutes);
server.use('/resources', resourcesRoutes);

// I always decoupe the server from the listen to facilitate the tests!
export default server;