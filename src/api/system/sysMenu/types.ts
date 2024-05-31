/* sysUser参数类型 */
export interface MenuData {
  id: number
  parentId: number
  type: number
  name: string
  path: string
  component: string
  perms: string
  icon: string
  sortValue: number
  status: number
  children: MenuData[]
  isSelect: boolean
}

/* RouterVo参数类型 */
export interface RouterVo {
  path: string
  hidden: boolean
  alwaysShow: boolean
  meta: MetaVo
  children: RouterVo[]
}

export interface MetaVo {
  title: string
  icon: string
}
