import * as events from 'events';
import * as Process from "child_process";
import { ICameraControl } from './ICameraControl';
import { CameraOptions } from './CameraOptions';

export class PythonScriptCameraControl extends events.EventEmitter implements ICameraControl {
    private isActive: boolean;
    private process: Process.ChildProcess;

    public constructor(private pythonScriptPath: string) {
        super();

        this.isActive = false;
    }

    public startStreaming(options: CameraOptions): Promise<void> {
        if (this.isActive) {
            return Promise.reject("already streaming");
        }

        return new Promise<void>((resolve, reject) => {
            this.process = Process.spawn("python", [this.pythonScriptPath, options.serverHost, options.serverPort.toString(), options.width.toString(), options.height.toString()]);
            this.process.stdout.once('data', (buffer: Uint8Array) => {
                const data: string = buffer.toString();
                if (data == 'STARTED') {
                    resolve();
                } else {
                    reject(data);
                }
            });
        })
    }

    public stopStreaming(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.isActive) {
                reject("not streaming at the first place");
                return;
            }

            this.process.once('close', (code: number, signal: string) => {
                resolve();
            })
            this.process.kill('SIGINT');
        });
    }

    public capture(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!this.isActive) {
                reject("cannot capture without streaming");
                return;
            }

            this.process.stdout.once('data', (buffer: Buffer) => {
                const dataBase64: string = buffer.toString('base64');
                resolve(dataBase64);
            });

            this.process.stdin.write('CAPTURE\n\r', (err: Error) => {
                if (err) {
                    reject(err);
                    return;
                }
            })
        });
    }
}
