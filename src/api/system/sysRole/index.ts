import { http } from '../../../utils/request'
import type { RoleData } from './types'

const requestContent = '/system/sysRole'
/**
 * 新增角色
 */
function addRole(sysRole: RoleData) {
  return http.post<string>(`${requestContent}/add`, sysRole)
}

/**
 * 修改角色
 */
function updateRole(sysRole: RoleData) {
  return http.put<string>(`${requestContent}/update`, sysRole)
}

/**
 * 删除角色
 */
function deleteRole(id: number) {
  return http.delete<string>(`${requestContent}/delete/${id}`)
}

/**
 * 获取所有角色列表
 */
function listAll() {
  return http.get<RoleData[]>(`${requestContent}/listAll`)
}

const RoleApi = {
  addRole,
  updateRole,
  deleteRole,
  listAll,
}

export default RoleApi
