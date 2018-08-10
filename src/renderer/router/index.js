import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/Home.vue'
import NotFound from '../components/NotFound';
import Credentials from '../components/Credentials';
import Processing from '../components/Processing';

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Homepage',
      component: Home
    },
    {
      path: '/not-found',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/credentials',
      name: "Credentials",
      component: Credentials
    },
    {
      path: '/processing',
      name: "Processing",
      component: Processing
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})