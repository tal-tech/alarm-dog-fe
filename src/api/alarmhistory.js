import request from '@/utils/request'
import { formatTimerange } from '@/utils/helpers'

export function histories (
  page = 1,
  pageSize = 20,
  departmentId = null,
  taskId = null,
  search = null,
  timerange = [],
  order = { id: 'desc' },
  sourceType = 1,
  actionPage = 'next',
  firstId = -1,
  lastId = -1,
  tagId = null
) {
  const params = { search, page, pageSize, departmentId, taskId, order, sourceType, actionPage, firstId, lastId, tagId }
  formatTimerange(timerange, params)
  return request({
    url: 'alarmhistory',
    method: 'get',
    params
  })
}

export function showHistory (historyId) {
  return request({
    url: 'alarmhistory/show',
    method: 'get',
    params: { historyId }
  })
}
