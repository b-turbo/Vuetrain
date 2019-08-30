import axios from '@/utils/myaxios.js'
export const getAllUsers = (params) => {
  return axios({
    url: 'users',
    params
  })
}
export const addUser = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}

export const editUser = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}

export const grantUserRole = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data: { rid: data.rid }
  })
}

export const updateUserstate = (uid, type) => {
  return axios({
    url: `users/${uid}/state/${type}`,
    method: 'put'
  })
}

export const DelUserById = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}
