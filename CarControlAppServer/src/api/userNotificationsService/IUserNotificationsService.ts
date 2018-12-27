import { ICaptureInfo } from "../../models/captures/ICapturInfo";
import { IMeasurementData } from "../../models/IMeasurementData";

export interface IUserNotificationsService {
    sendNotification(event: 'newCapture', payload: ICaptureInfo): void;
    sendNotification(event: 'robotConnectionStateChanged', payload: boolean);
    sendNotification(event: 'measurements', payload: IMeasurementData[]);
    sendNotification(event: 'error', payload: Error): void;

    on(event: 'error', cb: (error: Error) => void): IUserNotificationsService;
}