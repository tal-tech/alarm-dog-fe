
const MockData = {
  // 'alarmtemplate/defaults': {
  //   'get': true
  // },
}

const MockAll = true

export default function (config) {
  if (MockAll || (MockData[config.url] && MockData[config.url][config.method])) {
    config.baseURL = process.env.VUE_APP_BASE_API_MOCK
  }
}
