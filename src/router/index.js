import Vue from 'vue'
import Router from 'vue-router'
import Element from 'element-ui'
import Index from '@/components/Index'
import Login from '@/components/Login'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Router)
Vue.use(Element)

export default new Router({
  routes: [
    {path: '/', name: 'index', component: Index},
    {path: '/login', name: 'login', component: Login}
  ]
})
