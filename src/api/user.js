import request from '@/utils/request'

export function profile () {
  return request({
    url: 'user/profile',
    method: 'get'
  })
}

export function updatePhone (phone) {
  return request({
    url: 'user/updatephone',
    method: 'put',
    data: { phone }
  })
}

export function userSearch (search, pageSize = 20) {
  return request({
    url: 'user/search',
    method: 'get',
    params: { search, pageSize }
  })
}
