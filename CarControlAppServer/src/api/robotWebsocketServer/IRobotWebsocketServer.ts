import { IRobotMessage } from "./IRobotMessage";

export interface IRobotWebsocketServer {
    send(command: string): Promise<string[]>;

    on(event: 'error', cb: (error: Error) => void): IRobotWebsocketServer;
    on(event: 'connection', cb: () => void): IRobotWebsocketServer;
    on(event: 'disconnection', cb: (error?: Error) => void): IRobotWebsocketServer;
    on(event: 'capture', cb: (base64Data: string) => void): IRobotWebsocketServer;
}