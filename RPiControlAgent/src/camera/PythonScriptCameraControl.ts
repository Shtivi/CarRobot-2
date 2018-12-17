import * as events from 'events';
import * as Process from "child_process";
import * as fs from 'fs';
import { ICameraControl } from './ICameraControl';
import { CameraOptions } from './CameraOptions';

export class PythonScriptCameraControl extends events.EventEmitter implements ICameraControl {
    private isActive: boolean;
    private process: Process.ChildProcess;

    public constructor(private pythonScriptPath: string, private captureFilePath) {
        super();

        this.isActive = false;
    }

    public startStreaming(options: CameraOptions): Promise<void> {
        if (this.isActive) {
            return Promise.reject("already streaming");
        }

        return new Promise<void>((resolve, reject) => {
            this.process = Process.spawn("python", [this.pythonScriptPath, options.serverHost, options.serverPort.toString(), options.width.toString(), options.height.toString(), this.captureFilePath]);
            this.process.stdout.once('data', (buffer: Uint8Array) => {
                const data: string = buffer.toString();
                if (data == 'STARTED') {
                    this.isActive = true;
                    resolve();
                } else {
                    reject(data);
                }
            });
            
            this.process.once('close', (code: number, signal: string) => {
                this.isActive = false;
            })
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

            this.process.stdout.once('data', (buffer: Uint8Array) => {
                const data: string = buffer.toString().trim();
                if (data == 'CAPTURED') {
                    fs.readFile(this.captureFilePath, {}, (err: NodeJS.ErrnoException, data: Buffer) => {
                        if (err) {
                            reject({error: err});
                            return;
                        }

                        resolve(data.toString('base64'));
                    });
                } else {
                    reject(data);
                }

                return;
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
