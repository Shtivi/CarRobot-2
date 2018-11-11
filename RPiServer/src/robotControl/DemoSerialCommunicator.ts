import { IRobotCommunicator } from "./IRobotCommunicator";
import { SerialCommunicationOptions } from "./SerialCommunicationOptions";
import { RobotConnectionStatus } from "./RobotConnectionStatus";
import { RobotCommand } from "./RobotCommand";

export class DemoSerialCommunicator implements IRobotCommunicator<SerialCommunicationOptions> {
    private connectionStatus: RobotConnectionStatus;

    public connect(connectionOptions: SerialCommunicationOptions): Promise<void> {
        this.connectionStatus = RobotConnectionStatus.CONNECTED;
        return Promise.resolve();
    }    

    public disconnect(): Promise<void> {
        this.connectionStatus = RobotConnectionStatus.DISCONNECTED;
        return Promise.resolve();
    }
    public getConnectionStatus(): RobotConnectionStatus {
        return this.connectionStatus;
    }

    public sendCommand(command: RobotCommand): Promise<void> {
        return Promise.resolve();
    }
}