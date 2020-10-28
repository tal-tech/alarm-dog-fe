/**
 * 将字符串格式化为数字
 * @param {String} str 要格式化的数字
 * @param {Number|null} defaultVal 默认值
 * @return {Number}
 */
export function formatNumber (str, defaultVal = 0) {
  const num = Number(str)

  return isNaN(num) ? defaultVal : str
}

/**
 * 格式化数组中的数字
 * @param {Array} array 要格式化的数组
 * @param {Array} keys 要格式化的keys
 */
export function formatInArrayNumber (target = [], keys = []) {
  return target.map(row => {
    keys.forEach(key => {
      row[key] = formatNumber(row[key])
    })

    return row
  })
}

/**
 * 格式化对象中的数字
 * @param {Object} object 要格式化的对象
 * @param {Array} keys 要格式化的keys
 */
export function formatInObjectNumber (object = {}, keys = []) {
  for (const key in object) {
    if (keys.indexOf(key) > -1) {
      object[key] = formatNumber(object[key])
    }
  }

  return object
}

/**
 * 延迟执行回调
 * @param {Function} func 回调函数
 * @param {Number} wait 延迟时间
 * @param {Boolean} immediately 是否立即调用
 */
export function debounce (func, wait, immediately) {
  let timer
  const debounced = function (...args) {
    let result
    if (timer) clearTimeout(timer)
    if (immediately) {
      const called = !timer
      timer = setTimeout(() => {
        timer = null
      }, wait)
      if (called) {
        result = func.apply(this, args)
      }
    } else {
      timer = setTimeout(() => {
        func.apply(this, args)
      }, wait)
    }
    return result
  }
  debounced.cancel = function () {
    clearTimeout(timer)
    timer = null
  }
  return debounced
}

/**
 * 格式化时间筛选
 * @param {Array} timerange
 * @param {Object} params
 */
export function formatTimerange (timerange, params) {
  if (timerange && timerange[0]) {
    params['timerange[begin]'] = parseInt(timerange[0] / 1000)
  }
  if (timerange && timerange[1]) {
    params['timerange[end]'] = parseInt(timerange[1] / 1000)
  }
}
