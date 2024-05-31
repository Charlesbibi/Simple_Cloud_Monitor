import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import { message as Message } from 'ant-design-vue'

// import { useAuthStore } from '@/stores'
// const authStore = useAuthStore()

const routes: Array<RouteRecordRaw> = [
  {
    name: '404',
    path: '/404',
    component: () => import('../pages/404.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'dashboard' },
  },
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    redirect: { name: 'dashboard' },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },
      {
        name: 'orders',
        path: 'business/orders',
        component: () => import('../pages/business/orders/index.vue'),
      },
      {
        name: 'system',
        path: 'system',
        children: [
          {
            name: 'User',
            path: 'sysUser',
            component: () => import('../pages/system/sysUser/index.vue'),
          },
          // {
          //   name: 'Role',
          //   path: 'sysRole',
          //   component: () => import('../pages/system/sysRole/index.vue'),
          // },
          // {
          //   name: 'Menu',
          //   path: 'sysMenu',
          //   component: () => import('../pages/system/sysMenu/index.vue'),
          // },
        ],
      },
      {
        name: 'monitor',
        path: '/monitor',
        children: [
          {
            name: 'nacos',
            path: 'nacos',
            component: () => import('../pages/monitor/nacos/index.vue'),
          },
          {
            name: 'seata',
            path: 'seata',
            component: () => import('../pages/monitor/seata/index.vue'),
          },
          {
            name: 'sentinel',
            path: 'sentinel',
            component: () => import('../pages/monitor/sentinel/index.vue'),
          },
          {
            name: 'zipkin',
            path: 'zipkin',
            component: () => import('../pages/monitor/zipkin/index.vue'),
          },
        ],
      },
      {
        name: 'business',
        path: '/business',
        children: [
          {
            name: 'orders',
            path: 'orders',
            component: () => import('../pages/business/orders/index.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/RecoverPassword.vue'),
      },
      {
        name: 'recover-password-email',
        path: 'recover-password-email',
        component: () => import('../pages/auth/CheckTheEmail.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

// 设置哪些页面是属于白名单的
const witheList = ['/auth/login']

function isWitheRoute(path: string) {
  return witheList.includes(path)
}

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = window.sessionStorage.getItem('isAuthenticated')

  //防止重复登录
  if (isAuthenticated && (to.path === '/auth/login' || to.path === '/')) {
    Message.info('You have successfully logged in. Please avoid logging in repeatedly! (You can log out if you wish)')
    return next({ path: from.path ? from.path : '/' })
  }

  // 判断如果是白名单就直接放行
  if (isWitheRoute(to.path)) {
    next()
    return
  }
  // 没有登录，强制跳转到登录页面
  if (!isAuthenticated && to.path != '/auth/login') {
    Message.info('Please logging first')
    // 跳转到登录页
    window.location.href = '/auth/login'
    return
  }
  // window.addEventListener('beforeunload', (event) => {
  //   // 在这里可以执行一些操作，例如清除LocalStorage中的敏感信息
  //   console.log("destory");
  //   window.sessionStorage.removeItem('isAuthenticated')
  // });

  next()
})

export default router
