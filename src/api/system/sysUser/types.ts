import { RoleData } from '../sysRole/types'

/* sysUser参数类型 */
export interface UserData {
  id: number
  username: string
  email: string
  password: string
  phone: string
  headUrl: string
  name: string
  status: number
  roleList: RoleData[]
}

// Simulate API calls

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof UserData | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: number
  search: string
}
