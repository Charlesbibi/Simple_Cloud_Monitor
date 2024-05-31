import { http } from '../../../utils/request'
import type { LoginData, UserInfoRes } from './types'
import axios from 'axios'

const requestContent = '/simple/cloud/access'
/**
 * 登录
 */
export function login(loginVo: LoginData) {
  return http.post<UserInfoRes>(`${requestContent}/login`, loginVo)
}

/**
 * 获取登录用户信息
 */
export function getUserInfo() {
  return http.post<UserInfoRes>(`${requestContent}/info`)
}

/**
 * 刷新token
 */
export async function refresh(): Promise<string> {
  const refreshToken = window.sessionStorage.getItem('refreshToken')
  console.log('in ?>> ', refreshToken)
  if (refreshToken == undefined) return ''

  try {
    const response = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:9001/api/simple/cloud/access/refresh',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    })

    if (response.data) {
      window.sessionStorage.setItem('token', response.data.data.token)
      window.sessionStorage.setItem('tokenExpire', response.data.data.expire)
      console.log('token刷新成功 ---- ', response.data.data)
      return response.data.data
    } else {
      return ''
    }
  } catch (error) {
    console.log(error)
    return ''
  }
}

/**
 * 退出登录
 */
export function logout() {
  return http.post<string>(`${requestContent}/logout`)
}
