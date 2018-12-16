import * as events from 'events';
import { IMasterClient } from './IMasterClient';
import { MasterClientOptions } from './MasterClientOptions';
import { ConnectionStatus } from './ConnectionStatus';
import WebSocket from 'ws';
import { Retry } from '../utils/Retry';

export class MasterClient extends events.EventEmitter implements IMasterClient {
    private _options: MasterClientOptions;
    private _connectionStatus: ConnectionStatus;
    private _websocketClient: WebSocket;

    public constructor(options: MasterClientOptions) {
        super();
        
        this._options = options;
        this.validateOptions();

        this._connectionStatus = ConnectionStatus.DISCONNECTED;
    }

    public getConnectionStatus(): ConnectionStatus {
        return this._connectionStatus;
    }

    public connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this._options.allowRetry) {
                this.connectionActionCreator(resolve, reject);
            } else {
                let maxConnectionAttemps: number = <number> this._options.maxConnectionAttemps;
                Retry
                    .action<void>(this.connectionActionCreator)
                    .withThis(this)
                    .withMaxAttempts(maxConnectionAttemps)
                    .withAttemptsInterval(10000)
                    .handleNextAttempt((attemptNo: number) => console.log(`attempting to connect to remote master server: ${attemptNo} of ${maxConnectionAttemps}`))
                    .handleAttemptFailure((attemptNo: number, err: any) => console.error(`failed to connect: ${err}`))
                    .handleTermination(reject)
                    .handleSuccess((attemptNo: number) => resolve())
                    .run();
            }
        });
    }

    public disconnect(): void {
        if (this._connectionStatus != ConnectionStatus.CONNECTED) {
            throw new Error('could not disconnect: there was no connection');
        }
        this._websocketClient.close(1000);
    }

    public send(eventType: string, data: any): Promise<void> {
        if (this._connectionStatus != ConnectionStatus.CONNECTED) {
            return Promise.reject('could not send message: there was no connection');
        }

        return new Promise((resolve, reject) => {
            this._websocketClient.send(JSON.stringify({ eventType, data }), (err?: Error) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            })
        })
    }

    private connectionActionCreator(success, fail): void {
        let self = this;
        this._connectionStatus = ConnectionStatus.CONNECTING;
        this._websocketClient = new WebSocket(this._options.apiUrl)
            .once('open', () => {
                this._connectionStatus = ConnectionStatus.CONNECTED;
                this._websocketClient.on('message', (data: WebSocket.Data) => {
                    self.emit('data', data.toString());
                })
                success();
            })
            .once('closed',(code: number, reason: string) => {
                this._connectionStatus = ConnectionStatus.DISCONNECTED;
                fail(code);
            })
            .once('error', (err: any) => {
                this._connectionStatus = ConnectionStatus.DISCONNECTED;
                fail(err);
            });
    }

    private validateOptions(): void {
        if (this._options.allowRetry) {
            if (!this._options.maxConnectionAttemps) {
                throw new Error('Max connection attempts number was not specified in the options');
            } 
            
            if (isNaN(this._options.maxConnectionAttemps)) {
                throw new Error('Invalid max connection attempts number');
            }

            if (this._options.maxConnectionAttemps < 1) {
                throw new Error('Max connection attempts number cant be less than 1');
            }
        }
    }
}