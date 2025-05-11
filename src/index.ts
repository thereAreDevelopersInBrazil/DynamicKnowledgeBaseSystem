import { PORT } from "./constants/http";
import { seeds } from "./database/seeds";
import server from "./server";

async function main() {
    await seeds();
    server.listen(PORT, (err) => {
        if (err) {
            console.log('Error starting express server! Details: ' + err);
        } else {
            console.log("Express server running at port 3000! http://localhost:3000");
        }
    });
}

main();