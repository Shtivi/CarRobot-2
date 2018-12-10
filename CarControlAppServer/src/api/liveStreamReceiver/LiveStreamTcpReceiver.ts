import * as net from 'net';
import * as events from 'events';
import { ILiveStreamReceiver } from './ILiveStreamReceiver';
const  Split = require('stream-split');

export class LiveStreamTcpReceiver extends events.EventEmitter implements ILiveStreamReceiver {
    private tcpReceiverServer: net.Server;
    private NALSeparator;
    private headers: any[];

    public constructor(private port: number) {
        super();
        this.headers = [];
        this.NALSeparator = new Buffer([0,0,0,1])
    }

    public start(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.tcpReceiverServer = net
                .createServer(this.connectionsListener.bind(this))
                .listen(this.port, () => {
                    resolve();
                    // todo: when to reject??
                });
        })
    }

    public stop(): Promise<void> {
        if (!this.tcpReceiverServer) {
            return Promise.reject("server was not started");
        } 

        if (!this.tcpReceiverServer.listening) {
            return Promise.reject("server is not listenning");
        }

        return new Promise((resolve, reject) => {
            this.tcpReceiverServer.close(() => {
                resolve();
                // todo: when to reject??
            })
        })
    }

    public getHeaders(): any[] {
        return this.headers;
    }

    private connectionsListener(socket: net.Socket): void {
        this.tcpReceiverServer.getConnections((err: Error, count: number) => {
            if (err) {
                this.emit('error', err);
                return;
            }

            if (count > 1) {
                socket.end();
            } 
            
            this.emit('cameraConnection');
            socket.on('end', function() {
                this.emit('cameraDisconnection');
            });

            const NALSplitter = new Split(this.NALSeparator);
            NALSplitter.on('data', (data) => {
                data = Buffer.concat([this.NALSeparator, data]);
                if (this.headers.length < 3) {
                    this.headers.push(data);
                }
                this.emit('data', data);
            }).on('error', (err: Error) => {
                this.emit('error', err);
            });
            socket.pipe(NALSplitter);
        })
    }
}