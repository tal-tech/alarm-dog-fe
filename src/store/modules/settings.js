import defaultSettings from '@/settings'

const { title, showSettings, fixedHeader, fixedFooter, sidebarLogo, copyright, login } = defaultSettings

const settingsState = {
  title: title,
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  fixedFooter: fixedFooter,
  sidebarLogo: sidebarLogo,
  copyright: copyright,
  login
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting ({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state: settingsState,
  mutations,
  actions
}
