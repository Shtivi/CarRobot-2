import Vue from 'vue';
import App from './App.vue';

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

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
