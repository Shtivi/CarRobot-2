import express, { Router } from 'express';
import * as http from 'http'
import { Config } from './config/Config';
import ConfigLoader from './config/ConfigLoader';
import * as WebSocket from 'ws';
import { CommandsAPI } from './api/CommandsAPI';
import { IRouter } from 'express-serve-static-core';
import { ILiveStreamReceiver } from './api/liveStreamReceiver/ILiveStreamReceiver';
import { LiveStreamTcpReceiver } from './api/liveStreamReceiver/LiveStreamTcpReceiver';
import { IRobotWebsocketServer } from './api/robotWebsocketServer/IRobotWebsocketServer';
import { RobotWebsocketServer } from './api/robotWebsocketServer/RobotWebsocketServer';
import { ICapturesManager } from './captures/ICapturesManager';
import { CapturesManager } from './captures/CapturesManager';
import { CapturesAPI } from './api/CapturesAPI';

function main() {
    console.log("starting server initialization");
    const environment: string = (process.env.NODE_ENV ? process.env.NODE_ENV.trim().toUpperCase() : 'PROD');
    console.log(`environment set to: ${environment}`);
    
    console.log("loading configuration");
    const config: Config = ConfigLoader.loadConfig(environment);
    
    const app: express.Application = express();
    const httpServer: http.Server = http.createServer(app)

    console.log("booting up robot web socket server");    
    const robotWsServer: IRobotWebsocketServer = new RobotWebsocketServer(config.robotWsServer.path, httpServer, () => {
        console.log(`robot web socket server is listenning at: ws://localhost:${config.httpServer.port}${config.robotWsServer.path}`);
    }).on('connection', () => console.log('robot connected'))
        .on('disconnection', () => console.log('robot disconnected'))
        .on('capture', (base64Data: string) => {
            console.log("captured");
        })
    
    const capturesManager: ICapturesManager = new CapturesManager("");

    console.log("booting up http server");
    const generalRouter: IRouter = Router().use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            next();
        })
        .use('/commands', new CommandsAPI(robotWsServer).router())
        .use('/captures', new CapturesAPI(capturesManager).router());
    app.use('/api', generalRouter);
    httpServer.listen(config.httpServer.port, () => {
        console.log(`http server listenning at: http://localhost:${config.httpServer.port}`);
    });

    console.log("booting up live streaming tcp receiver");
    const liveStreamReceiver: ILiveStreamReceiver = new LiveStreamTcpReceiver(config.liveStreamingReceiver.port);
    liveStreamReceiver.on('cameraConnection', () => {
        console.log("camera connected");
    }).on('cameraDisconnection', () => {
        console.log("camera disconnected");
    }).start().then(() => {
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
}

main();