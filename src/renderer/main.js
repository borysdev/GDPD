import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'


import {
  LinkedInService
} from './services/linkedin';

import {
  ProgressService
} from './services/progress';

import {
  InjectorPlugin,
  RootMixin
} from './di';

Vue.use(InjectorPlugin, {
  scope: 'main',
  //debug: true,
  strategy: 'preload'
});

Vue.service('progress', ProgressService)
Vue.service('linkedin', LinkedInService, ['progress']);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
window.app = new Vue({
  components: {
    App
  },
  router,
  mixins: [RootMixin],
  template: '<App/>'
}).$mount('#app')