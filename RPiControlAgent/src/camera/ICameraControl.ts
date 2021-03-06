import { on } from 'cluster';
import { CameraOptions } from './CameraOptions';

export interface ICameraControl {
    startStreaming(options: CameraOptions): Promise<void>
    stopStreaming(): Promise<void>
    capture(): Promise<string>;

    on(eventName: 'error', cb: (error: Error) => void);
}