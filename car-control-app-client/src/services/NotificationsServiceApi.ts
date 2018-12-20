import * as events from 'events';
import { ICaptureInfo } from '@/models/ICaptureInfo';
import { Optional } from '@/utils/Optional';
import { INotification } from '@/models/INotification';

export interface INotificationsServiceApi {
    connect(url: string): void;
    disconnect(): void;
    isConnected(): boolean;

    on(event: 'newCapture', cb: (data: ICaptureInfo) => void): INotificationsServiceApi;

    on(event: 'error', cb: (err: Error) => void): INotificationsServiceApi;
    on(event: 'connected', cb: () => void): INotificationsServiceApi;
    on(event: 'disconnected', cb: (code: number, reason?: string) => void): INotificationsServiceApi;
}

export class NotificationsServiceApi extends events.EventEmitter implements INotificationsServiceApi {
    private socket: Optional<WebSocket>;
    
    public constructor() {
        super();
        this.socket = Optional.of();
    }

    public connect(url: string): void {
        if (this.isConnected()) {
            throw new Error("Already connected to notifications service");
        }

        this.socket = Optional.of(new WebSocket(url));
        this.socket.get().addEventListener('open', () => this.emit('connected'));
        this.socket.get().addEventListener('error', (ev: Event) => this.emit('error', ev.returnValue));
        this.socket.get().addEventListener('close', (ev: CloseEvent) => this.emit('disconnected', ev.code, ev.reason));
        this.socket.get().addEventListener('message', (ev) => this.messageHandler.bind(this)(ev));
    }

    public disconnect(): void {
        if (!this.isConnected()) {
            throw new Error('Cannot disconnect, not connected from the first place');
        }

        this.socket.get().close(1000, "according to user's reequest");
    }

    public isConnected(): boolean {
        return (this.socket.isPresent() && this.socket.get().readyState == 1);
    }

    private messageHandler(ev: MessageEvent): void {
        const msgData: INotification<any> = JSON.parse(ev.data);
        this.emit(msgData.event, msgData.payload);
    }
}