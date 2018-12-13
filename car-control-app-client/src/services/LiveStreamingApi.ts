import * as events from 'events';

export interface ILiveStreamingApi {
    start(): Promise<void>;
    stop(): Promise<void>;
    on(event: 'disconnected', cb: () => void): ILiveStreamingApi;
    on(event: 'connected', cb: () => void): ILiveStreamingApi;
}

export class LiveStreamingApi extends events.EventEmitter implements ILiveStreamingApi {
    constructor(private playerElementId: string, private streamerUrl: string) {
        super();
    }

    public stop(): Promise<void> {
        return Promise.reject("not implemeted");
    }

    public start(): Promise<void> {
        return new Promise((resolve, reject) => {
            window.streaming.start(
                this.playerElementId, 
                this.streamerUrl, 
                undefined, 
                false, 
                false, 
                (err?: Error) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    this.emit('connected');
                    resolve();
                },
                () => {
                    this.emit('disconnected');
                });
        })
    }
}