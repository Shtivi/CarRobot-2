import { Module } from 'vuex';
import { IRootState } from '@/store/IRootState';
import { INotificationsState } from './INotificationsState';
import { NotificationsPrinter } from '@/services/NotificationsPrinter';
import { IToastOptions } from '@/models/IToastOptions';
import { NotificationsServiceApi } from '@/services/NotificationsServiceApi';
import Config from '@/config/Config';
import { ICaptureInfo } from '@/models/ICaptureInfo';

export const notificationsModule: Module<INotificationsState, IRootState> = {
    namespaced: false,
    state: {
        notificationsPrinter: new NotificationsPrinter(),
        pushNotificationsService: new NotificationsServiceApi()
    },
    getters: {
        notificaotionsPrinter(state: INotificationsState): NotificationsPrinter {
            return state.notificationsPrinter;
        }
    },
    mutations: {

    },
    actions: {
        connectNotificationsService({ state, dispatch, commit }) {
            state.pushNotificationsService.on('connected', () => console.log('connected to push notifications'));
            state.pushNotificationsService.on('disconnected', () => console.log('disconnected from push notifications'));
            state.pushNotificationsService.on('newCapture', (capture: ICaptureInfo) => {
                dispatch('showNotification', { label: `Capture saved as '${capture.name}'` });
            });
            state.pushNotificationsService.connect(Config.api.notificationsService.url);
        },
        showNotification({ state }, payload: IToastOptions) {
            state.notificationsPrinter.showInfoToast(payload);
        }
    }
}