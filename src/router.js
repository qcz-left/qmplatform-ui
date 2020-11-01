import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home'
import Login from './components/Login'
import Welcome from './components/Welcome'
import UserList from "./components/user/UserList";
import MenuList from "./components/menu/MenuList";
import Role from './components/role/Role'
import Organization from "./components/organization/Organization";
import { Message } from 'element-ui';

Vue.use(Router);

const router = new Router({
  routes: [
    {path: '/login', component: Login},
    {
      path: '/',
      component: Home,
      redirect: '/welcome',
      children: [
        {path: '/welcome', component: Welcome},
        {path: '/userList', component: UserList},
        {path: '/menuList', component: MenuList},
        {path: '/role', component: Role},
        {path: '/organization', component: Organization}
      ]
    }
  ]
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  /**
   * to 将要访问的路径
   * from 代表从哪个路径跳转而来
   * next 是一个函数，表示放行；next()  放行    next('/login')  强制跳转
   */
  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) {
    Message.warning('当前会话已过期，请重新登录！')
    return next('/login')
  }
  next();
});

export default router
