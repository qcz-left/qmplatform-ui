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
Vue.prototype.openLoading = function (msg) {
  const loading = this.$loading({   // 声明一个loading对象
    lock: true,                             // 是否锁屏
    text: msg || '正在加载数据，请稍后...',     // 加载动画的文字
    spinner: 'el-icon-loading',             // 引入的loading图标
    background: 'rgba(0, 0, 0, 0.8)',       // 背景颜色
    body: true
  })
  setTimeout(function () {          // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
    loading.close();                        // 关闭遮罩层
  }, 5000)
  return loading;
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
