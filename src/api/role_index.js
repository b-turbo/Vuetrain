import axios from '@/utils/myaxios.js'

export const getRoleList = () => {
  return axios({
    url: 'roles'
  })
}

export const delRightByRoleId = (roleId, rightId) => {
  return axios({
    method: 'delete',
    url: `roles/${roleId}/rights/${rightId}`
  })
}

export const grantRoleById = (roleId, rids) => {
  return axios({
    method: 'post',
    url: `roles/${roleId}/rights`,
    data: { rids }
  })
}

export const addRole = (data) => {
  return axios({
    method: 'post',
    url: `roles`,
    data
  })
}
