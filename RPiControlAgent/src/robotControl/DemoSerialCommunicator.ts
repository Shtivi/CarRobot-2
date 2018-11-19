import { IRobotCommunicator } from "./IRobotCommunicator";
import { SerialCommunicationOptions } from "./SerialCommunicationOptions";
import { RobotConnectionStatus } from "./RobotConnectionStatus";
import { RobotCommand } from "./RobotCommand";
import { EventEmitter } from "events";

export class DemoSerialCommunicator extends EventEmitter implements IRobotCommunicator<SerialCommunicationOptions> {
    private connectionStatus: RobotConnectionStatus;

    public connect(connectionOptions: SerialCommunicationOptions): Promise<void> {
        this.connectionStatus = RobotConnectionStatus.CONNECTED;
        return Promise.resolve();
    }    

    public disconnect(): Promise<void> {
        this.connectionStatus = RobotConnectionStatus.DISCONNECTED;
        return Promise.resolve();
        this.emit('close');
    }
    public getConnectionStatus(): RobotConnectionStatus {
        return this.connectionStatus;
    }

    public sendCommand(command: RobotCommand): Promise<void> {
        return Promise.resolve();
    }
}