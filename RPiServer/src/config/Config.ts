export class Config {
    public port: number;
    public robot: {
        availableCommands: string[],
        serialPortName: string
    }
}