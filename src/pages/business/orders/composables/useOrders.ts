import { Ref, ref, unref, watch } from 'vue'
import { OrderData, Pagination } from '@/api/business/order/types'
import OrderApi from '@/api/business/order/order'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })

export const getOrders = async (filters: Pagination) => {
  try {
    let orders: OrderData[] = []
    // Fetch the user data using OrderApi.listAll()
    const data = await OrderApi.getAll()

    orders = data
    const filteredOrders = orders

    const { page = 1, perPage = 10 } = filters || {}

    // Return the filtered and paginated data
    return {
      data: filteredOrders.slice((page - 1) * perPage, page * perPage),
      pagination: {
        page,
        perPage,
        total: filteredOrders.length,
      },
    }
  } catch (error) {
    // Handle error here
  }
}

export const useOrders = (options?: { pagination?: Ref<Pagination> }) => {
  const isLoading = ref(false)
  const orders = ref<OrderData[]>([])

  const { pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const result = await getOrders({
      ...unref(pagination),
    })
    if (result) {
      const { data, pagination: newPagination } = result
      // Use 'data' and 'newPagination' here...
      orders.value = data

      ignoreUpdates(() => {
        pagination.value = newPagination
      })
    } else {
      // Handle the case when 'result' is undefined
    }

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination], fetch, { deep: true })

  fetch()

  return {
    isLoading,
    pagination,

    orders,

    fetch,
    // add order
    async add(order: OrderData) {
      isLoading.value = true
      try {
        await OrderApi.buy(order)
        await fetch()
      } finally {
        isLoading.value = false
      }
    },
  }
}
