export class Config {
    public httpServer: {
        port: number,
    };

    public robotWsServer: {
        path: string
    };

    public liveStreamingReceiver: {
        port: number
    }
}