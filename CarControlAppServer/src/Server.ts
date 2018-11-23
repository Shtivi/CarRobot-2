import express, { Router } from 'express';
import { Config } from './config/Config';
import ConfigLoader from './config/ConfigLoader';
import * as WebSocket from 'ws';
import { CommandsAPI } from './api/CommandsAPI';
import { IRouter } from 'express-serve-static-core';
import { NextFunction } from 'connect';

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
    });
})

console.log("booting up http server");
const app: express.Application = express();

const generalRouter: IRouter = Router();
generalRouter
    .use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        next();
    })
    .use('/commands', [new CommandsAPI(robotWsServer).router()]);
app.use('/api', generalRouter);

app.listen(config.httpServer.port, () => {
    console.log(`http server listenning at: http://localhost:${config.httpServer.port}`);
})