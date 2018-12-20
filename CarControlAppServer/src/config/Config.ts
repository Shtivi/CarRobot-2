export class Config {
    public httpServer: {
        port: number
    };

    public notificationsService: {
        path: string
    }

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

    public database: {
        configFile: string
    }
}