import { ICameraController } from "./ICameraController";
import WebSocket from 'ws';
const raspividStream = require('raspivid-stream');

export class WebsocketCameraController implements ICameraController {
    private websocketClient: WebSocket;
    private stream: any;

    public startStreaming(wssUrl: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.websocketClient = new WebSocket(wssUrl, { headers: { "isCamera": "true" } });
            this.websocketClient.on('open', (client: WebSocket) => {
                this.websocketClient = client;
                this.stream = raspividStream();
                this.stream.on('data', (data) => {
                    this.websocketClient.send(data, {binary:true}, (err: Error) => console.error(err));
                })
                resolve();
            }).on('error', (err: Error) => reject(err))
        });
    }

    public stopStreaming(): void {

    }
}