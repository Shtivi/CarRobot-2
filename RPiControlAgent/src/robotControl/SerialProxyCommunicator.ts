import { IRobotCommunicator } from "./IRobotCommunicator";
import { RobotCommand } from "./RobotCommand";
import { RobotConnectionStatus } from "./RobotConnectionStatus";
import { SerialCommunicationOptions } from "./SerialCommunicationOptions";
import { EventEmitter } from "events";
import * as Process from "child_process";

export class SerialProxyCommunicator extends EventEmitter implements IRobotCommunicator<SerialCommunicationOptions> {
    private connectionOptions: SerialCommunicationOptions;
    private pythonScriptPath: string;
    private pythonProcess: Process.ChildProcess;
    private connectionStatus: RobotConnectionStatus;
    
    public constructor(pythonScriptPath: string) {
        super();

        this.connectionStatus = RobotConnectionStatus.DISCONNECTED;
        this.pythonScriptPath = pythonScriptPath;
    }

    connect(connectionOptions: SerialCommunicationOptions): Promise<void> {
        this.connectionOptions = connectionOptions;
        return new Promise((resolve, reject) => {
            this.pythonProcess = Process.spawn('python', [this.pythonScriptPath], {
                env: {
                    "port": connectionOptions.serialPortName
                }
            });

            this.pythonProcess.stdout.once('data', (data: Uint8Array) => {
                if (data.toString() == 'READY') {
                    this.pythonProcess.stdout.on('data', (data: Uint8Array) => {
                        console.log(data.toString());
                    });
        
                    this.pythonProcess.stderr.on('data', (data: Uint8Array) => {
                        this.emit('error', data.toString());
                    })

                    this.pythonProcess.once('close', (code: number, signal: string) => {
                        this.connectionStatus = RobotConnectionStatus.DISCONNECTED;
                        this.emit('close');
                    })

                    this.connectionStatus = RobotConnectionStatus.CONNECTED;
                    resolve();
                } else {
                    reject(data);
                }
            })
        });
    }    
    
    disconnect(): Promise<void> {
        if (this.connectionStatus == RobotConnectionStatus.CONNECTED) {
            return new Promise((resolve, reject) => {
                this.pythonProcess.once('close', (code: number, signal: string) => {
                    resolve();
                })
                this.pythonProcess.kill('SIGINT');
            })
        } else {
            return Promise.reject("not connected");
        }
    }

    getConnectionStatus(): RobotConnectionStatus {
        return this.connectionStatus;
    }

    sendCommand(command: RobotCommand): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.connectionStatus == RobotConnectionStatus.CONNECTED) {
                this.pythonProcess.stdin.write(command.commandName + '\n\r', (error: Error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                });
            } else {
                reject("not connected");
            }
        })
    }
}