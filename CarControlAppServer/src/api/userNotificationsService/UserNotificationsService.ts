import * as http from 'http'
import { WebsocketServer } from '../websocketServer/WebsocketServer';
import * as events from 'events';
import { IUserNotificationsService } from './IUserNotificationsService';

export class UserNotificationsService extends events.EventEmitter implements IUserNotificationsService {
    
    private wss: WebsocketServer;

    public constructor(path: string, httpServer: http.Server) {
        super();
        this.wss = new WebsocketServer(path, httpServer);

        this.wss.on('error', (err: Error) => this.emit('error', err));
    }

    public sendNotification(event: string, payload: any) {
        this.wss.broadcast(JSON.stringify({ event, payload }));
    }
}