

import http from "http";
import color from "picocolors";
import connect from "connect";
import {indexHTMLMiddleware} from "./middleware";

const { PORT_HTTP, PROJECT_NAME, PORT_WS} = process.env

const createWSServer = () => {
    // const server = new WebSocketServer({ port: true });
    // server.on("connection", (ws) => {
    //     ws.on("message", (message) => {
    //         console.log("received: %s", message);
    //     });
    // })

    // const ws = new WebSocket("ws://localhost:9003");
    Bun.serve({
        port: PORT_WS,
        fetch(req, server) {
          if (server.upgrade(req)) {
            return;
          }
          return new Response("Upgrade failed :(", { status: 500 });
        },
        websocket: {
          open(ws) {
            color.green("WebSocket connection opened");
            ws.send("Hello from the server");
          },
          message(ws, message) {
            ws.send(message);
            console.log("Message received and echoed back");
          },
          close(ws, code, message) {
            console.log(`WebSocket closed with code ${code} and message ${message}`);
          },
          // 當 WebSocket 準備好接收更多數據
          drain(ws) {
            console.log("WebSocket is ready to receive more data");
          },
        },
      });
}

const middleware = connect();
middleware.use(indexHTMLMiddleware)

function createServer() {
    http.createServer(middleware).listen(PORT_HTTP);

    createWSServer();
    console.log(`${color.red(PROJECT_NAME)} Server On http://localhost:${color.green(PORT_HTTP)}`);
} 

export { createServer }


