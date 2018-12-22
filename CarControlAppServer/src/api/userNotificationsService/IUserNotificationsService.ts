import { ICaptureInfo } from "../../models/captures/ICapturInfo";

export interface IUserNotificationsService {
    sendNotification(event: 'newCapture', payload: ICaptureInfo): void;
    sendNotification(event: 'robotConnectionStateChanged', payload: boolean);
    sendNotification(event: 'error', payload: Error): void;
    // sendNotification(event: 'robotConnectionEvent', payload: )

    on(event: 'error', cb: (error: Error) => void): IUserNotificationsService;
}