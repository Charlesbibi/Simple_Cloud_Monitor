import { refresh } from '@/api/system/auth/index'
import { message as Message } from 'ant-design-vue'

class MyTimer {
  private timerId: any | null = null
  private delay: number
  private minCheck: number

  private static instance: MyTimer

  public static getInstance(): MyTimer {
    if (!MyTimer.instance) {
      MyTimer.instance = new MyTimer()
    }
    return MyTimer.instance
  }

  private constructor() {
    this.delay = 30000 // Default delay value in milliseconds
    this.minCheck = 60000 // Default minCheck value in milliseconds (1 minutes)
  }

  start(): void {
    this.timerId = setInterval(async () => {
      const currentToken = window.sessionStorage.getItem('token')
      console.log('timer++++', currentToken)
      if (currentToken) {
        // 如果存在token，判断是否过期
        const tokenExpireStr = window.sessionStorage.getItem('tokenExpire') as string // 假设有一个函数用于获取token的过期时间
        const expirationTime = parseInt(tokenExpireStr, 10)
        const timeRemaining = expirationTime - Date.now()
        console.log('ttime sub++++', timeRemaining)
        if (timeRemaining <= this.minCheck) {
          // 如果剩余时间小于等于minCheck分钟，则异步发送刷新请求并更新token
          try {
            await refresh()
          } catch (error) {
            console.error('刷新失败：', error)
            window.sessionStorage.removeItem('isAuthenticated')
            window.sessionStorage.removeItem('token')
            window.sessionStorage.removeItem('refreshToken')
            Message.error('token reflesh got some ploblem , please login')
            // 跳转到登录页的代码
            window.location.href = '/auth/login'
          }
        }
      } else {
        Message.error('token invalidate , please login')
        // token不存在 则跳转到登录页
        window.location.href = '/auth/login'
      }
    }, this.delay)

    console.log(this.timerId)
  }

  stop(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  }

  setDelay(delay: number): void {
    this.delay = delay
  }

  setMinCheck(minCheck: number): void {
    this.minCheck = minCheck
  }
}

export const myFilterInstance = MyTimer.getInstance()

export function onPageRender() {
  // Stop the current timer if it's running
  myFilterInstance.stop()

  // Start the timer with the updated delay and minCheck values
  myFilterInstance.start()
}
