import { http } from '@/utils/request'
import type { OrderData, BuyRes } from './types'

/**
 * 订单业务
 */
export function buy(data: OrderData) {
  return http.post<string>('/business/gateway/order/buy', data)
}

/**
 * 订单业务
 */
export function getAll() {
  return http.get<OrderData[]>('/business/gateway/order/getAll')
}

const OrderApi = {
  buy,
  getAll,
}

export default OrderApi
