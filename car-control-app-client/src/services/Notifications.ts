import Vue from 'vue';
import { IToastOptions } from '@/models/IToastOptions';
import MdSnackbar from 'vue-material';
import { ExtendedVue } from 'vue/types/vue';

export class Notifications {
    public constructor() {}

    public showInfoToast(options: IToastOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            const component = Vue.compile(`<md-snackbar :md-position="position" :md-active="show">{{label}}</md-snackbar>`);            
            const instance = new Vue({
                data: Object.assign({ 
                    show: true,
                    position: 'center' 
                }, options),
                render: component.render,
                staticRenderFns: component.staticRenderFns
            }).$mount();

            setTimeout(() => instance.show = false, options.duration || 4000)
        });
    }
}