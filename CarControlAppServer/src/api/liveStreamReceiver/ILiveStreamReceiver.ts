export interface ILiveStreamReceiver {
    start(): Promise<void>;
    stop(): Promise<void>;
    getHeaders(): any[];
    
    on(eventName: 'cameraConnection', cb: () => void);
    on(eventName: 'cameraDisconnection', cb: () => void);
    on(eventName: 'error', cb: (Error) => void);
    on(eventName: 'data', cb: (any) => void);
}