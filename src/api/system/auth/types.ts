/* 登录接口参数类型 */
export interface LoginData {
  email: string
  password: string
}

/* 用户信息接口返回值类型 */
export interface UserInfoRes {
  routers: []
  buttons: []
  roles: []
  name: string
  token: string
  tokenExpire: string
  refreshToken: string
}
