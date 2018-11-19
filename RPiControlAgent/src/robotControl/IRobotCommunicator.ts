import { RobotCommand } from "./RobotCommand";
import { RobotConnectionStatus } from "./RobotConnectionStatus";

export interface IRobotCommunicator<T> {
    connect(connectionOptions: T): Promise<void>;
    disconnect(): Promise<void>;
    getConnectionStatus(): RobotConnectionStatus;
    sendCommand(command: RobotCommand): Promise<void>;

    on(eventName: 'close', cb: (error?: Error) => void);
    once(eventName: 'close', cb: (error?: Error) => void);
}