import Vue from 'vue';
import App from './App.vue';

import 'vue-material/dist/vue-material.min.css';
import MdButton from 'vue-material';
import MdIcon from 'vue-material';
Vue.use(MdButton);
Vue.use(MdIcon);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
