/* order参数类型 */
export interface OrderData {
  id: number
  userId: number
  productId: number
  count: number
  money: number
}

// 使用类来定义默认值
export class OrderDataDefaults {
  id = -1
  userId = '1'
  productId = '1'
  count = 10
  money = 10
}

/* 订单接口返回值类型List<Order> */
export interface BuyRes {
  data: OrderData[]
}

// Simulate API calls

export type Pagination = {
  page: number
  perPage: number
  total: number
}
