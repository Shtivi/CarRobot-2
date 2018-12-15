import Vue from 'vue';
import App from './App.vue';

/* Material Design */
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

import MdButton from 'vue-material';
import MdIcon from 'vue-material';
import MdProgressSpinner from 'vue-material';
import MdCheckbox from 'vue-material';

Vue.use(MdButton);
Vue.use(MdIcon);
Vue.use(MdProgressSpinner);
Vue.use(MdCheckbox);

/* Vuex */
import Vuex, { StoreOptions } from 'vuex';
import { IRootState } from './store/IRootState';
import { liveStreamingModule } from './store/modules/liveStreaming/LiveStreamingModule';

Vue.use(Vuex);

const store: StoreOptions<IRootState> = {
    state: {
        version: "1.0.0"
    },
    modules: {
        liveStreaming: liveStreamingModule
    }
}

Vue.config.productionTip = false;
new Vue({
  render: (h) => h(App),
  store: new Vuex.Store(store)
}).$mount('#app');