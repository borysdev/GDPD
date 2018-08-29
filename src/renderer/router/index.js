import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/Home.vue'
import NotFound from '../components/NotFound';
import Upload from '../components/Upload';
import Processing from '../components/Processing';
import Download from '../components/Download';

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
      path: '/upload',
      name: 'Upload',
      component: Upload
    },
    {
      path: '/download',
      name: "Download",
      component: Download
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