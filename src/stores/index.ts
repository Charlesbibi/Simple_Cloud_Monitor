// store.ts
import { createPinia, defineStore } from 'pinia'
import { RoleData } from '@/api/system/sysRole/types'
import { RouterVo } from '@/api/system/sysMenu/types'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    token: '',
    tokenExpire: 0,
    isAuthenticated: false,
    routers: [] as RouterVo[],
    buttons: [] as string[],
    name: '',
    roles: [] as RoleData[],
  }),
  getters: {
    getButtons: (state) => state.buttons,
    getToken: (state) => state.token,
    getIsAuthenticated: (state) => state.isAuthenticated,
    getRouters: (state) => state.routers,
    getName: (state) => state.name,
    getRoles: (state) => state.roles,
    getTokenExpire: (state) => state.tokenExpire,
  },
  actions: {
    setRoles(roles: RoleData[]) {
      this.roles = roles
    },

    setTokenExpire(tokenExpire: number) {
      this.tokenExpire = tokenExpire
    },

    setButtons(buttons: string[]) {
      this.buttons = buttons
    },

    setRouters(routers: RouterVo[]) {
      this.routers = routers
    },

    setName(name: string) {
      this.name = name
    },

    setToken(token: string) {
      this.token = token
    },

    setIsAuthenticated(isAuthenticated: boolean) {
      this.isAuthenticated = isAuthenticated
    },

    reset() {
      this.roles = []
      this.name = ''
      this.buttons = []
      this.routers = []
      this.isAuthenticated = false
      this.token = ''
      this.tokenExpire = 0
    },
  },
})

export default createPinia()
