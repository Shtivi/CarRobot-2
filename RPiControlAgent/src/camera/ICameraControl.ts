import { on } from 'cluster';
import { CameraOptions } from './CameraOptions';

export interface ICameraControl {
    startStreaming(options: CameraOptions): Promise<void>
    stopStreaming(): Promise<void>
    capture(): any;

    on(eventName: 'error', cb: (error: Error) => void);
}