export class Config {
    public httpServer: {
        port: number,
    };

    public robotWsServer: {
        port: number,
        path: string
    };

    public liveStreamingReceiver: {
        port: number
    }
}