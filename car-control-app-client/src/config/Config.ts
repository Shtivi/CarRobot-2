export interface IConfig {
    api: {
        host: string,
        url: string,
        routes: {
            sendCommand: string
        }
    }
}

class Config implements IConfig {
    private serverUrl: string = "http://192.168.1.41:3000";

    public api = {
        host: this.serverUrl,
        url: this.serverUrl + "/api",
        routes: {
            sendCommand: "commands"
        },
        notificationsService: {
            url: "ws://192.168.1.41:3000/api/notifications"
        }
    }

    public liveStream = {
        streamerUrl: 'ws://192.168.1.41:3000/api/streaming'
    }
}

export default new Config();