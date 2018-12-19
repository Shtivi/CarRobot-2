import * as http from 'http'
import { WebsocketServer } from '../websocketServer/WebsocketServer';

export class UserNotificationsService {
    private wss: WebsocketServer;

    public constructor(path: string, httpServer: http.Server) {
        this.wss = new WebsocketServer(path, httpServer);
    }
}