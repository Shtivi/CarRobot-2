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
    private serverUrl: string = "http://localhost:3000";

    public api = {
        host: this.serverUrl,
        url: this.serverUrl + "/api",
        routes: {
            sendCommand: "commands"
        }
    }

    public liveStream = {
        streamerUrl: 'ws://localhost:3004/streaming'
    }
}

export default new Config();