import { IRobotCommunicator } from "./IRobotCommunicator";
import { RobotCommand } from "./RobotCommand";
import { init } from 'raspi';
import { Serial } from 'raspi-serial';
import { SerialCommunicationOptions } from "./SerialCommunicationOptions";
import { RobotConnectionStatus } from "./RobotConnectionStatus";

export class ArduinoSerialCommunicator implements IRobotCommunicator<SerialCommunicationOptions> {
    private connectionStatus: RobotConnectionStatus;
    private serial: Serial;

    public constructor() {
        this.connectionStatus = RobotConnectionStatus.DISCONNECTED;
    }

    public getConnectionStatus(): RobotConnectionStatus {
        return this.connectionStatus;
    }

    public connect(connectionOptions: SerialCommunicationOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            init(() => {
                this.serial = new Serial({
                    portId: connectionOptions.serialPortName
                });

                this.serial.open(() => {
                    this.connectionStatus = RobotConnectionStatus.CONNECTED;
                    resolve();
                });
            })
        });
    }

    public disconnect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.serial.close((err: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
    }

    sendCommand(command: RobotCommand): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.getConnectionStatus() != RobotConnectionStatus.CONNECTED) {
                reject('Cannot send command; The robot is not available.');
                return;
            }

            this.serial.write(command.commandName, () => {
                resolve();
            })
        })
    }
}