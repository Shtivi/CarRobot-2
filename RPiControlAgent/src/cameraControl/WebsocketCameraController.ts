import { ICameraController } from "./ICameraController";
import WebSocket from 'ws';
const raspividStream = require('raspivid-stream');

export class WebsocketCameraController implements ICameraController {
    private websocketClient: WebSocket;
    private stream: any;

    public startStreaming(wssUrl: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let self = this;
            this.websocketClient = new WebSocket(wssUrl, { headers: { "isCamera": "true" } });
            this.websocketClient.on('open', () => {
                self.stream = raspividStream();
                self.stream.on('data', (data) => {
                    self.websocketClient.send(data, {binary:true}, (err: Error) => {
                        if (err)
                            console.error("error sending video stream", err)
                    });
                })
                resolve();
            }).on('error', (err: Error) => reject(err))
        });
    }

    public stopStreaming(): void {

    }
}