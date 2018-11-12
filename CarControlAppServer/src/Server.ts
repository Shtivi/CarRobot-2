import express from 'express';
import { Config } from './config/Config';
import ConfigLoader from './config/ConfigLoader';
import * as WebSocket from 'ws';
import { CommandsAPI } from './api/CommandsAPI';

console.log("starting server initialization");
const environment: string = (process.env.NODE_ENV ? process.env.NODE_ENV.trim().toUpperCase() : 'PROD');
console.log(`environment set to: ${environment}`);

console.log("loading configuration");
const config: Config = ConfigLoader.loadConfig(environment);

console.log("booting up robot web socket server");
const robotWsServer = new WebSocket.Server({
    port: config.robotWsServer.port,
    path: config.robotWsServer.path
}, () => {
    console.log(`robot web socket server is listenning at: ws://localhost:${config.robotWsServer.port}${config.robotWsServer.path}`);
    robotWsServer.on('connection', (connection: WebSocket) => {
        console.log("connection");
        connection.send("on;");
    });
})

console.log("booting up http server");
const app: express.Application = express();

app.use(new CommandsAPI(robotWsServer).router)

app.listen(config.httpServer.port, () => {
    console.log(`http server listenning at: http://localhost:${config.httpServer.port}`);
})