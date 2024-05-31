/* 服务器返回数据的的类型，根据接口文档确定 */
export interface Result<T = any> {
  code: string
  message: string
  data: T
  timestamp: number
}

import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse, AxiosInstance, CancelTokenSource } from 'axios'
import { message as Message, message } from 'ant-design-vue'

//import { useRouter } from 'vue-router'
//const { push } = useRouter()
import { useAuthStore } from '@/stores'

/* 初始化 */
const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 1000000,

  headers: {
    'content-type': 'application/json; charset=utf-8',
  },
})

/* 请求拦截器 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    //获取token
    const token = window.sessionStorage.getItem('token')

    if (token || config.url === '/simple/cloud/access/login') {
      config.headers.Authorization = `Bearer ${token}`
      console.log(token, '>>>>>', window.sessionStorage.getItem('refreshToken'))
    } else {
      // 如果不存在 token，则拒绝请求并跳转到登录页面
      window.location.href = '/auth/login'

      //去除浏览器缓存
      window.sessionStorage.removeItem('isAuthenticated')
      return Promise.reject('Authenticated fail')
    }

    return config
  },
  (error: AxiosError) => {
    Message.error(error.message)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  // 响应成功进入第1个函数
  // 该函数的参数是响应对象
  function (response) {
    console.log(response)
    const status = response.data.code

    if (status == '200') return response.data.data

    let message = ''
    switch (status) {
      case '999':
        message = '添加失败，请联系管理员'
        break
      case '998':
        message = '删除失败，请联系管理员'
        break
      case '997':
        message = '修改失败，请联系管理员'
        break
      case '996':
        message = '获取数据异常，请联系管理员'
        break
      default:
        message = 'error'
        break
    }

    Message.error(message)
    throw new Error(response.data)
  },
  // 响应失败进入第2个函数，该函数的参数是错误对象
  async function (error) {
    console.log(error)
    // 如果响应码是 401 ，则请求获取新的 token
    // 响应拦截器中的 error 就是那个响应的错误对象
    if (error.response == undefined) return Promise.reject(error)

    const status = error.response.status
    const authStore = useAuthStore()
    let message = ''

    switch (status) {
      case 401 | 511:
        authStore.reset()
        window.sessionStorage.removeItem('isAuthenticated')
        window.sessionStorage.removeItem('token')
        window.sessionStorage.removeItem('refreshToken')
        message = 'token 失效，请重新登录'
        // 跳转到登录页
        window.location.href = '/auth/login'
        break
      case 511:
        message = '511occur'
        break
      case 403:
        message = '拒绝访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器故障'
        break
      default:
        message = '网络连接故障'
    }

    Message.error(message)
    return Promise.reject(error)
  },
)

/* 导出封装的请求方法 */
export const http = {
  get<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },

  post<T = any>(url: string, data?: object, config?: InternalAxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  put<T = any>(url: string, data?: object, config?: InternalAxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  },
}
