import { Module } from 'vuex';
import { IRootState } from '@/store/IRootState';
import { INotificationsState } from './INotificationsState';
import { Notifications } from '@/services/Notifications';
import { IToastOptions } from '@/models/IToastOptions';


export const notificationsModule: Module<INotificationsState, IRootState> = {
    namespaced: false,
    state: {
        notificationsService: new Notifications()
    },
    getters: {
        notificationsService(state: INotificationsState): Notifications {
            return state.notificationsService;
        }
    },
    actions: {
        notification({ state }, payload: IToastOptions) {
            state.notificationsService.showInfoToast(payload);
        }
    }
}