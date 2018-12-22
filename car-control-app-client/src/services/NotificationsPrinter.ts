import Vue from 'vue';
import { IToastOptions } from '@/models/IToastOptions';
import MdSnackbar from 'vue-material';
import { ExtendedVue } from 'vue/types/vue';

export class NotificationsPrinter {
    public constructor() {}

    public showInfoToast(options: IToastOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!options.actions) {
                options.actions = [{
                    label: 'OK',
                    callback: (hideToast: () => void) => hideToast()
                }]
            }

            Vue.toasted.show(options.label, this.adaptToastOptions(options));
            resolve();
        })
    }

    public showErrorToast(options: IToastOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            Vue.toasted.show(options.label, this.adaptToastOptions(options));
            resolve();
        })
    }

    public showWarningToast(options: IToastOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            Vue.toasted.show(options.label, this.adaptToastOptions(options));
            resolve();
        })
    }

    private adaptToastOptions(options: IToastOptions) {
        const adaptedActions = !options.actions ? [] : options.actions.map(action => {
            return {
                text: action.label || "",
                onClick: (e: any, toast: any) => action.callback(() => toast.goAway(0)),
                icon: action.icon
            }
        })

        return {
            duration: options.duration || 3000,
            closeOnSwipe: true,
            fitToScreen: true,
            type: 'default',
            icon: options.icon,
            position: <'top-right'>'top-right',
            action: adaptedActions
        }
    }
}