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
    private serverUrl: string = "http://192.168.1.44:3000";

    public api = {
        host: this.serverUrl,
        url: this.serverUrl + "/api",
        routes: {
            sendCommand: "commands"
        }
    }
}

export default new Config();