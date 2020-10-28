import { resetRouter } from '@/router'
import { verifyAccount, authEmail } from '@/api/auth'
import { profile } from '@/api/user'
import {
  getToken, setToken, removeToken, getUser, setUser, removeUser,
  getPermission, setPermission, removePermission
} from '@/utils/storage'

let permission
try {
  permission = JSON.parse(getPermission()) || { role: 0 }
} catch (e) {
  permission = { role: 0 }
}

const userState = {
  token: getToken(),
  user: JSON.parse(getUser()) || {},
  permission: permission
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_PERMISSION: (state, permission) => {
    state.permission = permission
  }
}

const actions = {
  // 登录(email)
  loginEmail ({ commit }, auth) {
    return new Promise((resolve, reject) => {
      authEmail(auth.email, auth.code)
        .then(res => {
          commit('SET_USER', res.data.user)
          commit('SET_PERMISSION', res.data.permission)
          setUser(res.data.user)
          setPermission(res.data.permission)
          resolve()
        }).catch(err => {
          reject(err)
        })
    })
  },

  // 登录（帐号密码）
  loginByAccount ({ commit }, auth) {
    return new Promise((resolve, reject) => {
      verifyAccount(auth.account, auth.password, auth.cid, auth.captcha)
        .then(res => {
          commit('SET_USER', res.data.user)
          commit('SET_PERMISSION', res.data.permission)
          setUser(res.data.user)
          setPermission(res.data.permission)
          resolve()
        }).catch(err => {
          reject(err)
        })
    })
  },

  // user logout
  logout ({ commit }) {
    commit('SET_TOKEN', '')
    commit('SET_USER', {})
    removeToken()
    removeUser()
    removePermission()
    resetRouter()
  },
  // 设置jwt token
  setToken ({ commit }, { token }) {
    commit('SET_TOKEN', token)
    setToken(token)
  },
  // 获取用户信息
  profile ({ commit }) {
    return new Promise((resolve, reject) => {
      profile()
        .then(res => {
          commit('SET_USER', res.data.user)
          commit('SET_PERMISSION', res.data.permission)
          setUser(res.data.user)
          setPermission(res.data.permission)
          resolve()
        }).catch(err => {
          reject(err)
        })
    })
  }
}

export default {
  namespaced: true,
  state: userState,
  mutations,
  actions
}
