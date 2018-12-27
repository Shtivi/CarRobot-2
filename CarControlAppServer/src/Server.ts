import express, { Router } from 'express';
import * as http from 'http'
import { Config } from './config/Config';
import ConfigLoader from './config/ConfigLoader';
import * as WebSocket from 'ws';
import * as path from 'path';
import { CommandsAPI } from './api/CommandsAPI';
import { IRouter } from 'express-serve-static-core';
import { ILiveStreamReceiver } from './api/liveStreamReceiver/ILiveStreamReceiver';
import { LiveStreamTcpReceiver } from './api/liveStreamReceiver/LiveStreamTcpReceiver';
import { IRobotWebsocketServer } from './api/robotWebsocketServer/IRobotWebsocketServer';
import { RobotWebsocketServer } from './api/robotWebsocketServer/RobotWebsocketServer';
import { ICapturesManager } from './captures/ICapturesManager';
import { CapturesManager } from './captures/CapturesManager';
import { CapturesAPI } from './api/CapturesAPI';
import { WebsocketServer } from './api/websocketServer/WebsocketServer';
import { LiveStreamingServer } from './api/LiveStreamingServer';
import { ICapture } from './models/captures/ICapture';
import { IDatabaseConfig } from './config/IDatabaseConfig';
import { connect, connection } from 'mongoose';
import { DBConnection } from './dal/mongoose/DBConnection';
import { CapturesDao } from './dal/mongoose/CapturesDao';
import { IUserNotificationsService } from './api/userNotificationsService/IUserNotificationsService';
import { UserNotificationsService } from './api/userNotificationsService/UserNotificationsService';
import { IMeasurementData } from './models/IMeasurementData';
import { IMeasurementsStateManager } from './measurements/IMeasurementsStateManager';
import { MeasurementsStateManager } from './measurements/MeasurementsStateManager';
import { MeasurementsAPI } from './api/MeasurementsAPI';

let config: Config;
let dbConfig: IDatabaseConfig;

let app: express.Application;
let httpServer: http.Server;
let userNotificationsService: IUserNotificationsService;
let robotWsServer: IRobotWebsocketServer;
let liveStreamReceiver: ILiveStreamReceiver;
let liveStreamingServer: LiveStreamingServer;

function main() {
    console.log("starting server initialization");
    const environment: string = (process.env.NODE_ENV ? process.env.NODE_ENV.trim().toUpperCase() : 'PROD');
    console.log(`environment set to: ${environment}`);
    console.log("loading configuration");
    config = ConfigLoader.loadConfig(environment);
    dbConfig = ConfigLoader.loadDatabaseConfig(config.database.configFile);
    
    app = express();
    httpServer = http.createServer(app)
    connectDatabase(dbConfig);

    // BL
    const capturesManager: ICapturesManager = 
        new CapturesManager(path.join(__dirname, "../", config.captures.dirName), new CapturesDao());
    const measurementsManager: IMeasurementsStateManager = new MeasurementsStateManager();

    console.log("booting up user notifications service");
    userNotificationsService = new UserNotificationsService(config.notificationsService.path, httpServer);

    console.log("booting up robot web socket server");    
    robotWsServer = new RobotWebsocketServer(config.robotWsServer.path, httpServer)
        .on('connection', () => robotConnectionChangedHook(true))
        .on('disconnection', () => robotConnectionChangedHook(false))
        .on('capture', (data: string) => capturedHook(data, capturesManager))
        .on('measurements', (data: IMeasurementData[]) => measurementsHook(data, userNotificationsService, measurementsManager));
    
    console.log("booting up http server");
    const generalRouter: IRouter = Router().use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            next();
        })
        .use('/commands', new CommandsAPI(robotWsServer).router())
        .use('/captures', new CapturesAPI(capturesManager).router())
        .use('/measurements', new MeasurementsAPI(measurementsManager).router());
    app.use('/api', generalRouter);
    httpServer.listen(config.httpServer.port, () => {
        console.log(`http server listenning at: http://localhost:${config.httpServer.port}`);
    });

    console.log("booting up live streaming tcp receiver");
    liveStreamReceiver = new LiveStreamTcpReceiver(config.liveStreamingReceiver.port);
    liveStreamReceiver.on('cameraConnection', () => {
        console.log("camera connected");
    }).on('cameraDisconnection', () => {
        console.log("camera disconnected");
    }).start().then(() => {
        console.log(`live streaming receiver is on :${config.liveStreamingReceiver.port}`);
    }).catch((err) => {
        console.error("failed to start live streaming receiver", err);
    });
    
    console.log("booting up streaming server");
    liveStreamingServer = new LiveStreamingServer(config.liveStreamingServer.path, httpServer, liveStreamReceiver);
}

function robotConnectionChangedHook(isConnected: boolean) {
    console.log(`robot ${isConnected ? 'connected' : 'disconnected'}`);
    userNotificationsService.sendNotification('robotConnectionStateChanged', isConnected);
}

function capturedHook(base64Data: string, capturesManager: ICapturesManager): void {
    console.log("recieved capture, saving...");

    capturesManager.newCapture(base64Data).then((capture: ICapture) => {
        console.log(`saved as ${capture.info.fileName}`);
        userNotificationsService.sendNotification('newCapture', capture.info);
    }).catch((err) => {
        console.error('failed saving capture', err)
        userNotificationsService.sendNotification("error", new Error(`An error occured while capturing: "${err}"`));
    });
}

function measurementsHook(measurements: IMeasurementData[], notificationsService: IUserNotificationsService, measurementsStateManager: IMeasurementsStateManager): void {
    measurements.forEach(measurementsStateManager.updateMeasurement.bind(measurementsStateManager));
    notificationsService.sendNotification('measurements', measurements);
}

function connectDatabase(dbconfig: IDatabaseConfig) {
    console.log("connecting to database...");

    const connectionString: string = DBConnection.buildMongoConnectionString(dbconfig);

    connect(connectionString).then(() => {
        console.log("connected to database");

        connection.once('disconnected', () => {
            console.log("database disconnected");
        })
    }).catch((err) => {
        console.error("failed to connect to database", err);
    })
}

main();