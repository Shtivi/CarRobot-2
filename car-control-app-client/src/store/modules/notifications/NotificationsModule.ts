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
            state.pushNotificationsService
                .on('connected', () => console.log('connected to push notifications'))
                .on('disconnected', () => console.log('disconnected from push notifications'))
                .on('newCapture', (capture: ICaptureInfo) => {
                    dispatch('showNotification', <IToastOptions> { 
                        label: `Capture saved as '${capture.name}'`,
                        actions: [{
                            label: 'SHOW ME',
                            callback: (hideToast: () => void) => {
                                // todo: open gallery
                                hideToast();
                            }
                        }, {
                            label: 'OK',
                            callback: (hideToast: () => void) => hideToast()
                        }]
                    });
                })
                .on('robotConnectionStateChanged', (isConnected: boolean) => {
                    commit('setMeasurementValue', {
                        measurementName: 'robotConnection',
                        value: isConnected
                    })
                    dispatch('showNotification', { label: `Robot ${isConnected ? 'connected' : 'disconnected'}`});
                })
                .on('error', (err: Error) => dispatch('showError', { label: err }))
            state.pushNotificationsService.connect(Config.api.notificationsService.url);
        },
        showNotification({ state }, payload: IToastOptions) {
            state.notificationsPrinter.showInfoToast(payload);
        },
        showError({ state }, payload: IToastOptions) {
            state.notificationsPrinter.showErrorToast(payload);
        },
        showWarning({ state }, payload: IToastOptions) {
            state.notificationsPrinter.showWarningToast(payload);
        }
    }
}