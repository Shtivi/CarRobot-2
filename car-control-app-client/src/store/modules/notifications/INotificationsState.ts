import { NotificationsPrinter } from '@/services/NotificationsPrinter';
import { INotificationsServiceApi } from '@/services/NotificationsServiceApi';

export interface INotificationsState {
    notificationsPrinter: NotificationsPrinter,
    pushNotificationsService: INotificationsServiceApi
}