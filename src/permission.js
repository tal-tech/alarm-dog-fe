import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/storage' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 针对URL跳转类型做拦截登录
  if (to.query.token) {
    await store.dispatch('user/loginDing', {
      token: to.query.token
    })

    const query = to.query
    delete query['token']

    next({ name: to.name, query, params: to.params })
  }

  // determine whether the user has logged in
  if (getToken()) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const userInfo = store.getters.user
      if (userInfo && userInfo.uid) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/profile')

          next()
        } catch (err) {
          console.log('err: ', err)
          // remove token and go to login page to re-login
          await store.dispatch('user/logout')
          Message.error(err || 'Has Error')
          next(`/login?callback=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token */

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      await store.dispatch('user/logout')
      next(`/login?callback=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
