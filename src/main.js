import Vue from 'vue'
import App from './components/App'
import {get, post, put, patch, del} from './util/http'
import {respSuccess} from './util/common'
import router from './router'
import './plugins/element.js'
import './plugins/dialog'
// 导入字体图标
import './assets/fonts/iconfont.css'
import './assets/css/global.css'

Vue.config.productionTip = false;
Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$put = put;
Vue.prototype.$patch = patch;
Vue.prototype.$del = del;
Vue.prototype.$respSuccess = respSuccess;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
