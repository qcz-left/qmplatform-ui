// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import {Message} from 'element-ui'
import App from './components/App'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false
axios.defaults.baseURL='/api'
Vue.prototype.$axios = axios
Vue.prototype.$message = Message

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
