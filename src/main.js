import Vue from 'vue'
import App from './components/App'
import axios from 'axios'

import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false
axios.defaults.baseURL = '/api'
Vue.prototype.$axios = axios

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})

axios.interceptors.response.use(response => {
  return response;
}, error => {
  // token 过期处理
  if (error.response.status == 401) {
    window.sessionStorage.removeItem('token');
    window.location.href = '/login';
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
