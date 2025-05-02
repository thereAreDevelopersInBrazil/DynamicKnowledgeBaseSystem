import express from 'express';
import { HTTPSTATUS, PORT } from './constants/http';
import usersRoutes from './routes/users';

const server = express();

server.get('/', (req, res) => {
    res.status(HTTPSTATUS.NOT_FOUND).end();
});

server.get('/healthcheck', (req, res) => {
    res.status(HTTPSTATUS.OK).end();
});

server.use(express.json());

server.use('/users', usersRoutes);

server.listen(PORT, (err) => {
    if (err) {
        console.log('Error starting express server! Details: ' + err);
    } else {
        console.log("Express server running at port 3000! http://localhost:3000");
    }
});