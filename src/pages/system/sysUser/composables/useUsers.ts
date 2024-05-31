import { Ref, ref, unref, watch } from 'vue'
import { UserData, type Filters, Pagination, Sorting } from '@/api/system/sysUser/types'
import UserApi from '@/api/system/sysUser'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'name', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: 1, search: '' })

const getSortItem = (obj: any, sortBy: string) => {
  return obj[sortBy]
}

export const getUsers = async (filters: Partial<Filters & Pagination & Sorting>) => {
  try {
    let users: UserData[] = []
    // Fetch the user data using UserApi.listAll()
    const data = await UserApi.listAll()

    console.log('-1>>>>', data)
    users = data
    let filteredUsers = users
    console.log('0>>>>', filteredUsers)
    const { isActive, search, sortBy, sortingOrder } = filters
    // Apply filter based on isActive
    filteredUsers = filteredUsers.filter((user) => user.status === isActive)

    console.log('1>>>>', filteredUsers)
    // Apply filter based on search
    if (search) {
      filteredUsers = filteredUsers.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
    }

    console.log('2>>>>', filteredUsers)
    // Apply sorting
    if (sortBy && sortingOrder) {
      filteredUsers = filteredUsers.sort((a, b) => {
        const first = getSortItem(a, sortBy)
        const second = getSortItem(b, sortBy)
        if (first > second) {
          return sortingOrder === 'asc' ? 1 : -1
        }
        if (first < second) {
          return sortingOrder === 'asc' ? -1 : 1
        }
        return 0
      })
    }
    console.log('3>>>>', filteredUsers)
    const { page = 1, perPage = 10 } = filters || {}

    // Return the filtered and paginated data
    return {
      data: filteredUsers.slice((page - 1) * perPage, page * perPage),
      pagination: {
        page,
        perPage,
        total: filteredUsers.length,
      },
    }
  } catch (error) {
    // Handle error here
  }
}

export const useUsers = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const users = ref<UserData[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const result = await getUsers({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    if (result) {
      const { data, pagination: newPagination } = result
      // Use 'data' and 'newPagination' here...
      users.value = data

      ignoreUpdates(() => {
        pagination.value = newPagination
      })
    } else {
      // Handle the case when 'result' is undefined
    }

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination, sorting], fetch, { deep: true })

  watch(
    filters,
    () => {
      // Reset pagination to first page when filters changed
      pagination.value.page = 1
      fetch()
    },
    { deep: true },
  )

  fetch()

  return {
    isLoading,

    filters,
    sorting,
    pagination,

    users,

    fetch,
    // add user method
    async add(user: UserData) {
      isLoading.value = true
      try {
        await UserApi.addUser(user)
        await fetch() // fetch data after add
      } finally {
        isLoading.value = false // if some problem occur, table need to unLoad
      }
    },

    async update(user: UserData) {
      isLoading.value = true
      try {
        await UserApi.updateUser(user)
        await fetch() // fetch data after update
      } finally {
        isLoading.value = false
      }
    },

    async remove(id: number) {
      isLoading.value = true
      try {
        await UserApi.deleteUser(id) // fetch data after delete
        await fetch()
      } finally {
        isLoading.value = false
      }
    },
  }
}
