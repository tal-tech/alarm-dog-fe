import request from '@/utils/request'

export function tagList (page = 1, pageSize = 20, search = null) {
  return request({
    url: 'alarmtag',
    method: 'get',
    params: { search, page, pageSize }
  })
}

export function tagUpdate (id, data) {
  data['id'] = id
  return request({
    url: 'alarmtag',
    method: 'put',
    data
  })
}

export function tagDelete (id) {
  return request({
    url: 'alarmtag',
    method: 'delete',
    params: { id }
  })
}

export function tagStore (data) {
  return request({
    url: 'alarmtag',
    method: 'post',
    data
  })
}

export function tagSearch (search = null, pageSize = 20) {
  return request({
    url: 'alarmtag/search',
    method: 'get',
    params: { search, pageSize }
  })
}
