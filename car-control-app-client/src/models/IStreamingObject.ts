export interface IStreamingObject {
    start(
        elementId: string,
        uri: string,
        token?: string,
        useWorker?: boolean,
        webgl?: boolean,
        onConnected?: (err?: Error) => void,
        onDisconnected?: () => void
    ): void;

    ws: WebSocket;
}