<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <div class="right-menu-item" style="top: -5px; width: 160px">
        <el-select v-model="buId" size="mini" filterable placeholder="请选择事业部" id="selector-bu">
          <el-option
            v-for="businessUnit in businessUnits"
            :key="businessUnit.id"
            :label="businessUnit.name"
            :value="businessUnit.id">
          </el-option>
        </el-select>
      </div>

      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper" id="user-dropdown">
          <img src="@/assets/img/avatar-80.gif" class="user-avatar">
          <span class="user-name">{{ user.username }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link :to="{ name: 'UserProfile' }">
            <el-dropdown-item >
              <svg-icon icon-class="user" /> 用户信息
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <svg-icon icon-class="logout" /> 退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { simpleBusinessUnits } from '@/api/businessUnit'
import { formatInArrayNumber } from '@/utils/helpers'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data () {
    return {
      businessUnits: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'user'
    ]),
    buId: {
      get () {
        return this.$store.state.app.buId
      },
      set (val) {
        this.$store.dispatch('app/setBuID', val)
      }
    }
  },
  created () {
    this.getBusinessUnits()
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    getBusinessUnits () {
      simpleBusinessUnits()
        .then(res => {
          this.businessUnits = formatInArrayNumber(res.data.business_units, ['id'])
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    position: relative;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      position: relative;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        height: 64px;
        cursor: pointer;
        position: relative;
        padding: 15px 0;
        .user-avatar {
          float: left;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          margin-right: 5px;
        }

        .user-name {
          float: left;
          line-height: 24px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
