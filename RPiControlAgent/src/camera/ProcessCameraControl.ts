import * as events from 'events';
import * as Process from "child_process";
import { ICameraControl } from "./ICameraControl";
import { CameraOptions } from "./CameraOptions";

export class ProcessCameraControl extends events.EventEmitter implements ICameraControl {
    private options: CameraOptions;
    private raspividProcess: Process.ChildProcess;

    public constructor(private captureScriptPath: string) {
        super();
    }

    public startStreaming(options: CameraOptions): Promise<void> {
        this.options = options;
        return new Promise((resolve, reject) => {
            try {
                this.raspividProcess = Process.spawn("raspivid", [
                    ' -w ', options.width.toString(),
                    ' -h ', options.height.toString(),
                    ' -fps ', options.fps.toString(),
                    " -t 0 ",
                    "-ih ",
                    "-b 700000 ",
                    "-pf baseline ",
                    "-o - ",
                    "|",
                    " nc ", options.serverHost, options.serverPort.toString()
                ]);
                resolve();
            } catch (err) {
                reject(err);
                this.emit('error', err);
            } 
        })
    }

    public stopStreaming(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.raspividProcess || this.raspividProcess.killed || !this.raspividProcess.connected) {
                reject("no streaming to stop");
                return;
            }

            this.raspividProcess.once('close', (code: number, signal: string) => {
                resolve();
            })
            this.raspividProcess.kill('SIGINT');
        })
    }

    public capture(width: number, height: number): Promise<string> {
        return new Promise((resolve, reject) => {
            const captureProcess: Process.ChildProcess = 
                Process.spawn('python', [this.captureScriptPath, width.toString(), height.toString()]);
            
            process.stdout.once('data', (data: any) => {
                resolve(data);
            });
            
            process.stderr.once('data', (err: any) => {
                reject(err);
            })
        });
    }
}