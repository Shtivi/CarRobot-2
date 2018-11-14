import * as events from 'events';
import { IMasterClient } from './IMasterClient';
import { MasterClientOptions } from './MasterClientOptions';
import { ConnectionStatus } from './ConnectionStatus';
import WebSocket from 'ws';

export class MasterClient extends events.EventEmitter implements IMasterClient {
    private _options: MasterClientOptions;
    private _connectionStatus: ConnectionStatus;
    private _websocketClient: WebSocket;

    public constructor(options: MasterClientOptions) {
        super();

        this._options = options;
        this._connectionStatus = ConnectionStatus.DISCONNECTED;
    }

    public getConnectionStatus(): ConnectionStatus {
        return this._connectionStatus;
    }

    public connect(): Promise<void> {
        this._connectionStatus = ConnectionStatus.CONNECTING;

        return new Promise((resolve, reject) => {
            this._websocketClient = new WebSocket(this._options.apiUrl);
            
            this._websocketClient.on('open', () => {
                this._connectionStatus = ConnectionStatus.CONNECTED;
                resolve();
            });

            this._websocketClient.on('close', )
        });
    }

    public disconnect(): Promise<void> {

    }
}