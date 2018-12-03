import express, { Router } from 'express';
import { Config } from './config/Config';
import ConfigLoader from './config/ConfigLoader';
import * as WebSocket from 'ws';
import { CommandsAPI } from './api/CommandsAPI';
import { IRouter } from 'express-serve-static-core';
import { NextFunction } from 'connect';
import { ILiveStreamReceiver } from './api/liveStreamReceiver/ILiveStreamReceiver';
import { LiveStreamTcpReceiver } from './api/liveStreamReceiver/LiveStreamTcpReceiver';
import { IncomingMessage } from 'http';

console.log("starting server initialization");
const environment: string = (process.env.NODE_ENV ? process.env.NODE_ENV.trim().toUpperCase() : 'PROD');
console.log(`environment set to: ${environment}`);

console.log("loading configuration");
const config: Config = ConfigLoader.loadConfig(environment);

console.log("booting up robot web socket server");
const robotWsServer = new WebSocket.Server({ port: config.robotWsServer.port, path: config.robotWsServer.path}, () => {
    console.log(`robot web socket server is listenning at: ws://localhost:${config.robotWsServer.port}${config.robotWsServer.path}`);
    robotWsServer.on('connection', (connection: WebSocket, request: IncomingMessage) => {
        console.log("robot connection");
    });
})

console.log("booting up live streaming tcp receiver");
const liveStreamReceiver: ILiveStreamReceiver = new LiveStreamTcpReceiver(config.liveStreamingReceiver.port);
liveStreamReceiver.start().then(() => {
    console.log(`live streaming receiver is on :${config.liveStreamingReceiver.port}`);
}).catch((err) => {
    console.error("failed to start live streaming receiver", err);
});

// todo: put in config
console.log("booting up streaming server");
const liveStreamingServer = new WebSocket.Server({ port: 3004, path: '/streaming' }, () => {
    console.log(`live streaming server is on ws://localhost:${3004}/streaming`);
    liveStreamReceiver.on('data', (data: any) => {
        liveStreamingServer.clients.forEach((client: WebSocket) => {
            if (client.readyState == 1) {
                client.send(data, {binary: true}, (err: Error) => {
                    if (err) {
                        console.error("error sending the streaming data to client", err);
                        client.close();
                    }
                });
            }
        });
    });
});

// const streamWsServer = new WebSocket.Server({
//     port: 3002,
//     path: '/stream'
// }, () => {
//     console.log('streaming websocket server is listenning at: ws://localhost:3002/stream');
//     streamWsServer.on('connection', (connection: WebSocket, request: IncomingMessage) => {
//         if (request.headers['iscamera']) {
//             console.log('camera streamer connected');
//             connection.on('message', (data: WebSocket.Data) => {
//                 streamWsServer.clients.forEach((client: WebSocket) => {
//                     if (client != connection) {
//                         client.send(data, {binary: true})
//                     }
//                 })
//             })
//         } else {
//             console.log("streaming client connected");
//         }
//     })
// })

console.log("booting up http server");
const app: express.Application = express();
const generalRouter: IRouter = Router()
    .use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        next();
    })
    .use('/commands', [new CommandsAPI(robotWsServer).router()]);

app
    .use('/api', generalRouter)
    .listen(config.httpServer.port, () => {
        console.log(`http server listenning at: http://localhost:${config.httpServer.port}`);
    })