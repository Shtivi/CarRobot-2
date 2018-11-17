import { IRobotCommunicator } from "./IRobotCommunicator";
import { RobotCommand } from "./RobotCommand";
import { init } from 'raspi';
import { Serial } from 'raspi-serial';
import { SerialCommunicationOptions } from "./SerialCommunicationOptions";
import { RobotConnectionStatus } from "./RobotConnectionStatus";

export class ArduinoSerialCommunicator implements IRobotCommunicator<SerialCommunicationOptions> {
    private connectionStatus: RobotConnectionStatus;
    private connectionOptions: SerialCommunicationOptions;
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
                this.connectionStatus = RobotConnectionStatus.CONNECTED;
                this.connectionOptions = connectionOptions;
                resolve();
                // this.serial = new Serial({
                //     portId: connectionOptions.serialPortName
                // });

                // this.serial.open(() => {
                //     resolve();
                // });
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
            this.serial = new Serial({
                portId: this.connectionOptions.serialPortName
            });

            this.serial.open(() => {
                this.serial.write(command.commandName, () => resolve());
            });
            // if (this.getConnectionStatus() != RobotConnectionStatus.CONNECTED) {
            //     reject('Cannot send command; The robot is not available.');
            //     return;
            // }
            // this.serial.write(command.commandName, () => {
            //     this.serial.flush((err: any) => {
            //         if (err) {
            //             reject(err);
            //         } else {
            //             resolve();
            //         }
            //     });
            // })
        })
    }
}