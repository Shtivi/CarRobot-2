export class Config {
    public robot: {
        availableCommands: string[],
        serialPortName: string,
        measurements: {
            interval: number
        }
    }

    public api: {
        url: string,
        retryPolicy: {
            allowRetry: boolean,
            maxConnectionAttempts: number
        }
    }

    public camera: {
        width: number,
        height: number,
        fps: number,
        serverHost: string,
        serverPort: number
    }
}