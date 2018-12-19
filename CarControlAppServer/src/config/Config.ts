export class Config {
    public httpServer: {
        port: number,
    };

    public robotWsServer: {
        path: string
    };

    public liveStreamingServer: {
        path: string
    }

    public liveStreamingReceiver: {
        port: number
    }

    public captures: {
        dirName: string
    }
}