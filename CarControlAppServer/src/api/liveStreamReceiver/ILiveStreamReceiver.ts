export interface ILiveStreamReceiver {
    start(): Promise<void>;
    stop(): Promise<void>;
    getHeaders(): any[];
    
    on(eventName: 'cameraConnection', cb: () => void): ILiveStreamReceiver;
    on(eventName: 'cameraDisconnection', cb: () => void): ILiveStreamReceiver;
    on(eventName: 'error', cb: (Error) => void): ILiveStreamReceiver;
    on(eventName: 'data', cb: (any) => void): ILiveStreamReceiver;
}