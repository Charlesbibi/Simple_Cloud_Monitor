import { http } from '../../../utils/request'
import type { MenuData } from './types'

const requestContent = '/system/sysMenu'

/**
 * 新增菜单
 */
function addMenu(sysMenu: MenuData) {
  return http.post<string>(`${requestContent}/add`, sysMenu)
}

/**
 * 更新菜单
 */
function doAssign(id: number, idList: number[]) {
  return http.put<string>(`${requestContent}/doAssign/${id}`, idList)
}

/**
 * 删除菜单
 */
function deleteMenu(id: number) {
  return http.delete<string>(`${requestContent}/delete/${id}`)
}

/**
 * 获取菜单的树形结构
 */
function getNodeList() {
  return http.get<MenuData[]>(`${requestContent}/getNodeList`)
}

/**
 * 根据roleID获取到 按钮权限
 * */
function getAssignByRoleId(id: number) {
  return http.get<number[]>(`${requestContent}/getAssign/${id}`)
}

const MenuApi = {
  addMenu,
  doAssign,
  deleteMenu,
  getNodeList,
  getAssignByRoleId,
}

export default MenuApi
