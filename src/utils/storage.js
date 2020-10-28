import { storagePrefix } from '@/settings'

const jwtUserKey = 'jwt-user'

export function getUser () {
  return localStorage.getItem(storagePrefix + jwtUserKey)
}

/**
 * 设置用户信息
 * @param {Object} user 用户信息
 */
export function setUser (user) {
  return localStorage.setItem(storagePrefix + jwtUserKey, JSON.stringify(user))
}

export function removeUser () {
  return localStorage.removeItem(storagePrefix + jwtUserKey)
}

const permissionKey = 'permission'

export function getPermission () {
  return localStorage.getItem(storagePrefix + permissionKey)
}

/**
 * @param {Object} permission 权限信息
 */
export function setPermission (permission) {
  return localStorage.setItem(storagePrefix + permissionKey, JSON.stringify(permission))
}

export function removePermission () {
  return localStorage.removeItem(storagePrefix + permissionKey)
}

const jwtTokenKey = 'jwt-token'

export function getToken () {
  return localStorage.getItem(storagePrefix + jwtTokenKey)
}

/**
 * 设置JWT Token
 * @param {String} token JWT-TOKEN
 */
export function setToken (token) {
  return localStorage.setItem(storagePrefix + jwtTokenKey, token)
}

export function removeToken () {
  return localStorage.removeItem(storagePrefix + jwtTokenKey)
}

const loginEmailKey = 'login-email'

export function getLoginEmail () {
  return localStorage.getItem(storagePrefix + loginEmailKey)
}

/**
 * 设置登录邮箱前缀
 * @param {String} email 邮箱前缀
 */
export function setLoginEmail (email) {
  return localStorage.setItem(storagePrefix + loginEmailKey, email)
}

export function removeLoginEmail () {
  return localStorage.removeItem(storagePrefix + loginEmailKey)
}

/**
 * 设置事业部ID
 * @param {Number} buId 邮箱前缀
 */
export function setBuID (buId) {
  return localStorage.setItem(storagePrefix + 'buId', buId)
}

/**
 * 获取事业部ID
 * @return {Number} buId
 */
export function getBuID () {
  const buId = localStorage.getItem(storagePrefix + 'buId')
  return isNaN(parseInt(buId)) ? null : parseInt(buId)
}
