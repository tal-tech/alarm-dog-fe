import request from '@/utils/request'

export function sendEmail (email, cid, captcha) {
  return request({
    url: 'auth/mail',
    method: 'post',
    data: { email, cid, captcha }
  })
}

export function authEmail (email, code) {
  return request({
    url: 'auth/verifymail',
    method: 'post',
    data: { email, code }
  })
}

export function logout () {
  return request({
    url: 'logout',
    method: 'post'
  })
}

export function getCaptche (cid = null) {
  return request({
    url: 'auth/captcha',
    method: 'get',
    params: { cid }
  })
}

export function verifyAccount (account, password, cid, captcha) {
  return request({
    url: 'auth/verifyaccount',
    method: 'post',
    data: { account, password, cid, captcha }
  })
}
