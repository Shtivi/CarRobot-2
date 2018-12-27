import * as WebSocket from 'ws';
import * as http from 'http';
import * as events from 'events';
import * as url from 'url';
import { IncomingMessage } from 'http';
import { IRobotWebsocketServer } from './IRobotWebsocketServer';
import { IRobotMessage } from './IRobotMessage';
import { Socket } from 'net';
import { Optional } from '../../utils/Optional';
import { WebsocketServer } from '../websocketServer/WebsocketServer';

export class RobotWebsocketServer extends events.EventEmitter implements IRobotWebsocketServer {
    private wss: WebsocketServer;

    public constructor(private path: string, private httpServer: http.Server) {
        super();
        this.wss = new WebsocketServer(path, httpServer);
        this.wss.on('connection', this.connectionHandler.bind(this));
    }

    public send(command: string): Promise<string[]> {
        if (this.wss.clients.size == 0) {
            return Promise.resolve(["There's no one to get this command, the robot is not connected."])
        }

        return new Promise((resolve, reject) => {
            this.wss.broadcast(command);
            resolve([]);
        })
    }

    private connectionHandler(socket: WebSocket, request: IncomingMessage): void {
        this.emit('connection');
        socket.on('close', this.disconnectionHandler.bind(this));
        socket.on('message', this.messageHandler.bind(this));
    }

    private disconnectionHandler(code: number, reason: string): void {
        if (code != 1000) {
            this.emit('disconnection', reason)
        }
    }

    private messageHandler(rawData: WebSocket.Data): void {
        const parsedData: IRobotMessage<any> = JSON.parse(rawData.toString()) as IRobotMessage<any>;

        switch (parsedData.eventType) {
            case 'capture':
                this.emit('capture', parsedData.data); 
                break;
            case 'measurements': 
                this.emit('measurements', parsedData.data);
                break;
        }
    }
}