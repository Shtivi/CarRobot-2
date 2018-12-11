import * as events from 'events';

export interface ILiveStreamingApi {
    start(): Promise<void>;
    //stop(): Promise<void>;
    on(event: 'disconnected', cb: () => void): ILiveStreamingApi;
    on(event: 'connected', cb: () => void): ILiveStreamingApi;
}

export class LiveStreamingApi extends events.EventEmitter implements ILiveStreamingApi {
    constructor(private playerElementId: string, private streamerUrl: string) {
        super();
    }

    public start(): Promise<void> {
        return new Promise((resolve, reject) => {
            (<any>window).startStream(this.playerElementId, 
                this.streamerUrl, 
                null, 
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