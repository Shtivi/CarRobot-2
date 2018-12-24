export interface IConfig {
    api: {
        host: string,
        url: string,
        routes: {
            sendCommand: string,
            getLatestCaptures: string
        }
    }
}

class Config implements IConfig {
    private hostname: string = "192.168.1.41";
    private serverUrl: string = `http://${this.hostname}:3000`;

    public api = {
        host: this.serverUrl,
        url: this.serverUrl + "/api",
        routes: {
            sendCommand: "commands",
            getLatestCaptures: "captures/latest"
        },
        notificationsService: {
            url: `ws://${this.hostname}:3000/api/notifications`
        }
    }

    public liveStream = {
        streamerUrl: `ws://${this.hostname}:3000/api/streaming`
    }
}

export default new Config();