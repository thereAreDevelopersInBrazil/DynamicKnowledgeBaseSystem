import { PORT } from "./constants/http";
import server from "./server";

server.listen(PORT, (err) => {
    if (err) {
        console.log('Error starting express server! Details: ' + err);
    } else {
        console.log("Express server running at port 3000! http://localhost:3000");
    }
});