import Vue from 'vue'
import ElementUI from 'element-ui'
import axios from 'axios'

import { ipcRenderer } from 'electron'
import { ebtRenderer } from 'electron-baidu-tongji'

import App from './App'
import router from './router'
import store from './store'
import filters from '@/filters'

import 'element-ui/lib/theme-chalk/index.css'

// 替换为你自己的 百度统计 siteId
const BAIDU_SITE_ID = 'efc69e9cd6c7f372713c99db3394cf2d'

Vue.use(ElementUI)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// 将过滤器注册到vue中
Object.keys(filters).forEach((k) => Vue.filter(k, filters[k]))

// 百度统计
ebtRenderer(ipcRenderer, BAIDU_SITE_ID, router)

String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, 'gm'), s2)
}

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
