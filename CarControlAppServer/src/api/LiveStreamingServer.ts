import * as http from 'http';
import { ILiveStreamReceiver } from './liveStreamReceiver/ILiveStreamReceiver';
import { WebsocketServer } from './websocketServer/WebsocketServer';

export class LiveStreamingServer {
    private wss: WebsocketServer;

    public constructor(private path: string, private httpServer: http.Server, private liveStreamReceiver: ILiveStreamReceiver) {
        this.wss = new WebsocketServer(path, httpServer);
        this.liveStreamReceiver.on('data', this.dataRecieved.bind(this));
    }

    private dataRecieved(data: any): void {
        this.wss.broadcast(data, true);
    }
}