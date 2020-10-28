import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import Mock from '@/api/mock'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 120000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 开启开发环境代理
    if (process.env.NODE_ENV === 'development' && process.env.VUE_APP_BASE_API_MOCK) {
      Mock(config)
    }
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + store.getters.token
    }
    return config
  },
  error => {
    // do something with request error
    console.error(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    if (res.code > 0) {
      // 登录
      if (response.status === 401) {
        store.dispatch('user/logout').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
        return
      }

      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(res.msg || '网络开了点小差，请稍后再试~')
    } else {
      // 自动设置token
      if (response.headers['authorization']) {
        const token = response.headers['authorization'].substr('Bearer '.length)
        store.dispatch('user/setToken', { token })
      }
      // if ((process.env.NODE_ENV === 'development' || process.env.VUE_APP_MOCK_TOKEN) && res.data.token) {
      //   store.dispatch('user/setToken', { token: res.data.token })
      // }

      return res
    }
  },
  error => {
    if (error.response) {
      if (error.response.data && error.response.data.msg) {
        console.error(error.response)
        error.message = error.response.data.msg
      }
      // 登录
      if (error.response.status === 401) {
        store.dispatch('user/logout').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
        return
      }
    }
    Message({
      message: error.message || '网络开了点小差，请稍后再试~',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
