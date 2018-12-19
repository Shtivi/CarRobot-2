import * as WebSocket from 'ws';
import * as http from 'http';
import * as url from 'url';
import * as events from 'events';
import { Optional } from '../../utils/Optional';
import { Socket } from 'net';

export class WebsocketServer extends WebSocket.Server {
    public constructor(public path: string, private httpServer: http.Server, callback?: () => void) {
        super({
            noServer: true
        });

        httpServer.on('upgrade', this.upgradeHandler.bind(this));
        this.on('listening', () => {
            if (callback) {
                callback()
            }
        });
    }

    public broadcast(data: any, binary?: boolean) {
        this.clients.forEach((client: WebSocket) => {
            if (client.readyState == 1) {
                client.send(data, {binary}, (err: Error) => {
                    if (err) {
                        this.emit('error', err);
                    }
                })
            }
        })
    }

    private upgradeHandler(request: http.IncomingMessage, socket: Socket, head: Buffer): void {
        if (!request.url) {
            socket.destroy(new Error("no url"));
            return;
        }

        Optional.of(url.parse(request.url).pathname).ifNotPresent(() => {
            socket.destroy();
        }).ifPresnet((pathname: string) => {
            if (pathname === this.path) {
                super.handleUpgrade(request, socket, head, (ws) => {
                    this.emit('connection', ws, request);
                })
            }
        })
    }
}