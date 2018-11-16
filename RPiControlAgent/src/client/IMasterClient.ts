import { ConnectionStatus } from "./ConnectionStatus";

export interface IMasterClient {
    getConnectionStatus(): ConnectionStatus;
    connect(): Promise<void>;
    disconnect(): void;

    on(event: 'termination', cb: () => void);
    on(event: 'data', cb: (data: string) => void);
    on(event: 'error', cb: (error: Error) => void);
}