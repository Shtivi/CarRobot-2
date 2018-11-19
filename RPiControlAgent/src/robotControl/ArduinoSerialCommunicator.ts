import SerialPort from 'serialport';
import { IRobotCommunicator } from './IRobotCommunicator';
import { SerialCommunicationOptions } from './SerialCommunicationOptions';
import { RobotConnectionStatus } from './RobotConnectionStatus';
import { RobotCommand } from './RobotCommand';
import { EventEmitter } from 'events';

export class ArduinoSerialCommunicator extends EventEmitter implements IRobotCommunicator<SerialCommunicationOptions> {
    private serialPort: SerialPort;
    private connectionOptions: SerialCommunicationOptions;
    private connectionStatus: RobotConnectionStatus;

    public constructor() {
        super();
        this.connectionStatus = RobotConnectionStatus.DISCONNECTED;
    }

    public connect(connectionOptions: SerialCommunicationOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            this.connectionOptions = connectionOptions;
            this.serialPort = new SerialPort(this.connectionOptions.serialPortName, { baudRate: 9600 }, (err: Error) => {
                if (err) {
                    this.emit('error', err);
                    reject(err);
                    return;
                }

                this.emit('open');

                this.serialPort.on('error', (err: any) => this.emit('error', err));
                this.serialPort.on('close', (err: any) => this.emit('close', err));
                
                resolve();
            })
        })
    }

    public disconnect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.serialPort.isOpen) {
                let err: Error = new Error("cannot close serial port - it's not open");
                this.emit('error', err)
                reject(err);
                return;
            }

            this.serialPort.close((err: Error) => {
                if (err) {
                    this.emit('error', err)
                    reject(err);
                    return;
                }
                this.emit('close');
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
                    this.emit('error', error);
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