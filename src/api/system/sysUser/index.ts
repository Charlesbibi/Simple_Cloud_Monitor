import { http } from '../../../utils/request'
import type { UserData } from './types'

const requestContent = '/system/sysUser'
/**
 * 为用户分配角色（1用户 - n角色)
 */
function assignRoles(uid: number, roleIDs: number[]) {
  return http.post<string>(`${requestContent}/assignRoles/${uid}`, roleIDs)
}

/**
 * 根据用户id获取所有的角色id（可能对应多个角色）
 */
function getAllUserRole(id: number) {
  return http.get<number[]>(`${requestContent}/getAllUserRole/${id}`)
}

/**
 * 新增用户
 */
function addUser(sysUser: UserData) {
  return http.post<string>(`${requestContent}/add`, sysUser)
}

/**
 * 修改用户
 */
function updateUser(sysUser: UserData) {
  return http.put<string>(`${requestContent}/update`, sysUser)
}

/**
 * 删除用户
 */
function deleteUser(id: number) {
  return http.delete<string>(`${requestContent}/delete/${id}`)
}

/**
 * 获取所有用户列表
 */
function listAll() {
  return http.get<UserData[]>(`${requestContent}/listAll`)
}

const UserApi = {
  assignRoles,
  getAllUserRole,
  addUser,
  updateUser,
  deleteUser,
  listAll,
}

export default UserApi
