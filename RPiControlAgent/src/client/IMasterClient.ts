import { ConnectionStatus } from "./ConnectionStatus";

export interface IMasterClient {
    getConnectionStatus(): ConnectionStatus;
    connect(): Promise<void>;
    disconnect(): Promise<void>;

    on(event: 'retry', cb: () => void);
    on(event: 'disconnection', cb: () => void);
    on(event: 'data', cb: (data: string) => void);
    on(event: 'error', cb: (error: Error) => void);
}