import SerialPort from 'serialport';
import { IRobotCommunicator } from './IRobotCommunicator';
import { SerialCommunicationOptions } from './SerialCommunicationOptions';
import { RobotConnectionStatus } from './RobotConnectionStatus';
import { RobotCommand } from './RobotCommand';

export class ArduinoSerialCommunicator implements IRobotCommunicator<SerialCommunicationOptions> {
    private serialPort: SerialPort;
    private connectionOptions: SerialCommunicationOptions;
    private connectionStatus: RobotConnectionStatus;

    public constructor() {
        this.connectionStatus = RobotConnectionStatus.DISCONNECTED;
    }

    public connect(connectionOptions: SerialCommunicationOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            this.connectionOptions = connectionOptions;
            this.serialPort = new SerialPort(this.connectionOptions.serialPortName, { baudRate: 9600 }, (err: Error) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            })
        })
    }

    public disconnect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.serialPort.isOpen) {
                reject("cannot close serial port - it's not open");
                return;
            }

            this.serialPort.close((err: Error) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            })
        });
    }

    public sendCommand(command: RobotCommand): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.serialPort.isOpen) {
                reject("cannot send command: serial port is not open");
                return;
            }

            this.serialPort.write(command.commandName, (error: any) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            })
        })
    }

    getConnectionStatus(): RobotConnectionStatus {
        return this.connectionStatus;
    }
}