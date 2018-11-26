import { IRobotCommunicator } from "./IRobotCommunicator";
import { RobotCommand } from "./RobotCommand";
import { RobotConnectionStatus } from "./RobotConnectionStatus";

export class SerialProxyCommunicator implements IRobotCommunicator<void> {

    connect(connectionOptions: void): Promise<void> {
        throw new Error("Method not implemented.");
    }    
    
    disconnect(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getConnectionStatus(): RobotConnectionStatus {
        throw new Error("Method not implemented.");
    }

    sendCommand(command: RobotCommand): Promise<void> {
        throw new Error("Method not implemented.");
    }

    on(eventName: "close", cb: (error?: Error | undefined) => void) {
        throw new Error("Method not implemented.");
    }

    once(eventName: "close", cb: (error?: Error | undefined) => void) {
        throw new Error("Method not implemented.");
    }
}