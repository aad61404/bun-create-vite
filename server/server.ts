

import http from "http";
import color from "picocolors";
import connect from "connect";
import {indexHTMLMiddleware} from "./middleware";

const { PORT_HTTP, PROJECT_NAME} = process.env

const middleware = connect();
middleware.use(indexHTMLMiddleware)

function createServer() {
    http.createServer(middleware).listen(PORT_HTTP);

    console.log(`${color.red(PROJECT_NAME)} Server On http://localhost:${color.green(PORT_HTTP)}`);
} 

export { createServer }


