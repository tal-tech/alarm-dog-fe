<template>
  <div class="login-wrapper">
    <div class="container">
      <div class="title">
        <img src="@/assets/img/logo.png" class="sidebar-logo">
        <h1>{{ title }} <span> — 统一告警平台</span></h1>

      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="帐号密码登录" name="account">
          <el-form ref="userForm" :model="userForm" :rules="userFormRules" label-width="100px" class="form-wrapper">
            <el-form-item prop="account">
              <el-input
                v-model="userForm.account"
                placeholder="用户名"
                name="account"
                type="text"
              >
                <svg-icon slot="prefix" icon-class="user" />
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="userForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                aria-autocomplete="off"
                autocomplete="off"
              >
                <svg-icon slot="prefix" icon-class="password" />
                <template slot="suffix">
                  <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                  </span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="captcha" class="captcha-image">
              <el-input
                v-model="captchaForm.captcha"
                class="captcha-image-input"
                placeholder="验证码"
                name="captcha"
                aria-autocomplete="off"
                autocomplete="off"
              />
              <img
                v-show="captchaForm.captchaMeta"
                :src="captchaForm.captchaMeta"
                class="captcha-image-image"
                alt="验证码"
                title="点击刷新验证码"
                @click="getImageCaptcha"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="login-btn" @click="loginByAccount">登 录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="邮箱登录" name="email">
          <el-form ref="emailForm" :model="emailForm" :rules="emailFormRules" label-width="100px" class="form-wrapper">
            <el-form-item prop="email">
              <el-input ref="email" v-model="emailForm.email" placeholder="邮箱" />
            </el-form-item>
            <el-form-item prop="captcha" class="captcha-image">
              <el-input
                v-model="captchaForm.captcha"
                class="captcha-image-input"
                placeholder="Captcha"
                name="captcha"
                aria-autocomplete="off"
                autocomplete="off"
              />
              <img
                v-show="captchaForm.captchaMeta"
                :src="captchaForm.captchaMeta"
                class="captcha-image-image"
                alt="验证码"
                title="点击刷新验证码"
                @click="getImageCaptcha"
              />
            </el-form-item>
            <el-form-item prop="code" class="captcha-email">
              <el-input v-model="emailForm.code" class="captcha-email-input" placeholder="验证码"/>
              <el-button :disabled="emailCodeStat === 1" class="captcha-email-btn" @click="getEmailCode">
                {{ emailCodeStat === 0 ? '发送验证码' : time + 's后重新发送' }}
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="login-btn" @click="loginByEmail">登 录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getLoginEmail, setLoginEmail } from '@/utils/storage'
import { getCaptche, sendEmail } from '@/api/auth'

export default {
  name: 'Login',
  data () {
    return {
      activeName: 'account',
      emailForm: {
        email: null,
        code: null
      },
      emailFormRules: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'change' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'change' },
          { min: 6, max: 6, message: '验证码为6位', trigger: 'blur' }
        ]
      },
      userForm: {
        account: null,
        password: null
      },
      captchaForm: {
        cid: null,
        captcha: null,
        captchaMeta: null
      },
      userFormRules: {
        account: [
          { required: true, message: '用户名不能为空', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' }
        ]
      },
      time: 60, // 倒计时
      clickMark: 1, // 防止重复发送请求
      emailCodeStat: 0, // 判断发送验证码按钮可点击状态,
      passwordType: 'password'
    }
  },
  computed: {
    title () {
      return this.$store.state.settings.title
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted () {
    this.getImageCaptcha()
    // 获取账号
    if (getLoginEmail()) {
      this.emailForm.email = getLoginEmail()
    }
  },
  methods: {
    // 获取验证码
    getImageCaptcha () {
      getCaptche(this.captchaForm.cid).then(res => {
        this.captchaForm = {
          cid: res.data.cid,
          captcha: null,
          captchaMeta: res.data.captcha
        }
      })
    },
    // 发送验证码
    getEmailCode () {
      this.$refs['emailForm'].validateField('email', (error) => {
        if (error === '' && this.clickMark === 1) {
          this.clickMark = 0
          return new Promise((resolve, reject) => {
            sendEmail(this.emailForm.email, this.captchaForm.cid, this.captchaForm.captcha)
              .then(res => {
                this.emailCodeStat = 1
                this.resetEmailSendTime()
                const clock = setInterval(() => {
                  this.time--
                  if (this.time < 0) {
                    clearInterval(clock)
                    this.resetEmailSendTime()
                    this.emailCodeStat = 0
                  }
                }, 1000)
                this.clickMark = 1
                resolve()
              }).catch(errorParam => {
                this.clickMark = 1
                reject(errorParam)
              })
          })
        }
      })
    },
    // 邮箱登录
    loginByEmail () {
      this.$refs['emailForm'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('user/loginEmail', {
            email: this.emailForm.email,
            code: this.emailForm.code
          }).then(() => {
            setLoginEmail(this.emailForm.email)
            if (this.$route.query.redirect) {
              this.$router.push(decodeURIComponent(this.$route.query.redirect))
            } else {
              this.$router.push({ name: 'Dashboard' })
            }
          })
        }
      })
    },
    // 帐号密码登录
    loginByAccount () {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('user/loginByAccount', {
            account: this.userForm.account,
            password: this.userForm.password,
            cid: this.captchaForm.cid,
            captcha: this.captchaForm.captcha
          }).then(() => {
            if (this.$route.query.redirect) {
              this.$router.push(decodeURIComponent(this.$route.query.redirect))
            } else {
              this.$router.push({ name: 'Dashboard' })
            }
          })
        }
      })
    },
    // 重置可发送邮箱验证码时间
    resetEmailSendTime () {
      this.time = 60
    },
    showPwd () {
      this.passwordType = this.passwordType == 'password' ? 'text' : 'password'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url('../../assets/img/back-bg.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-origin: content-box;
  background-clip: content-box;
  background-attachment: fixed;
  background-color: #f1f2f6;
  .container {
    text-align: center;
    width: 300px;
    height: 450px;
    position: absolute;
    top: -100px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    .title {
      img {
        width: 32px;
        height: 32px;
        vertical-align: middle;
        margin-right: 12px;
      }
      h1 {
        display: inline-block;
        margin: 0;
        font-weight: 600;
        line-height: 50px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        vertical-align: middle;
        font-size: 24px;
        span {
          font-size: 16px;
          font-weight: normal;
          color: #333;
        }
      }
    }
    .el-tabs {
      .el-tabs__header {
        margin-bottom: 0;
      }
      .el-tabs__item {
        font-size: 18px;
        width: 150px;
        padding: 0;
      }
    }
    .form-wrapper {
      padding: 20px;
      .el-form-item__content {
        margin-left: 0 !important;
        .el-input-group__append {
          padding: 0 10px;
        }
      }
      .captcha-image {
        .captcha-image-input {
          width: 100px;
          float: left;
        }
        .captcha-image-image {
          width: 150px;
          float: right;
          border-radius: 4px;
          cursor: pointer;
        }
      }
      .captcha-email {
        .captcha-email-input {
          width: 140px;
          float: left;
        }
        .captcha-email-btn {
          width: 110px;
          float: right;
          padding: 12px 0;
        }
      }
      .login-btn {
        width: 100%;
      }
    }
  }
}

</style>
