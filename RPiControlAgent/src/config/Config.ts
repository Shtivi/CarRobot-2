export class Config {
    public robot: {
        availableCommands: string[],
        serialPortName: string
    }

    public api: {
        url: string,
        retryPolicy: {
            allowRetry: boolean,
            maxConnectionAttempts: number
        }
    }
}