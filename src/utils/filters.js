/**
 *
 * @param {Number} timestamp 时间戳
 * @param {String} format 格式
 * @param {Number} enlarge 放大倍数
 */
export function formatDate (timestamp, format = 'yyyy-MM-dd hh:mm:ss', enlarge = 1000) {
  const date = new Date(timestamp * enlarge)

  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }

  return format
}

/**
 * 格式化百分比
 * @param {Number} number 数字
 * @param {Number} fixedLength 小数点长度
 */
export function percentage (number, fixedLength = 2) {
  return parseFloat((number * 100).toFixed(fixedLength)) + '%'
}

/**
 * 差异格式化百分数
 * @param {Number} number 数字
 * @param {String} roundFunc 近似值函数，round|floor|ceil
 * @param {String} suffix 后缀
 * @param {Number} fixedLength 小数点位数
 */
export function diffentPercentage (number, roundFunc = 'round', suffix = undefined, fixedLength = 2) {
  const num = Math[roundFunc]((number * Math.pow(10, fixedLength + 2))) / Math.pow(10, fixedLength)
  return suffix ? num + suffix : num
}

/**
 * 格式化字节
 * @param {Number} size 字节大小
 * @param {Number} fixedLength 小数点个数
 */
export function formatBytes (size, fixedLength = 2) {
  const units = ['B', 'K', 'M', 'G', 'T']
  let index = 0

  while (size >= 1024) {
    size /= 1024
    index++
  }

  return parseFloat(size.toFixed(fixedLength)) + ' ' + units[index]
}

/**
 * 移除邮箱后缀
 * @param {String} email 邮箱
 */
export function removeEmailSuffix (email) {
  return email.split('@', 1).join('')
}

/**
 * 字符串默认值
 * @param {String} value
 */
export function defaultZero (value, defaultValue = '0') {
  return value == null ? defaultValue : value
}

/**
 * 字符串替换
 * @param {String} value 字符串
 * @param {String} string 原值
 * @param {String} replacement 替换值
 */
export function strReplace (value, xstring, replacement) {
  return value.replace(xstring, replacement)
}

/**
 * 格式化数字（千位符）
 * @param  {Number} number        [number：要格式化的数字]
 * @param  {Number} decimals      [decimals：保留几位小数]
 * @param  {String} decPoint      [decPoint]
 * @param  {String} thousandsSep  [thousandsSep：千分位符号]
 * @param  {String} roundtag      [roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入]
 * @return {String}               [description]
 *
 */
export function formatNumber (number, decimals = 0, decPoint = '.', thousandsSep = ',', roundtag = 'round') {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '')

  const n = !isFinite(+number) ? 0 : +number
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
  const toFixedFix = function (nParams, precParams) {
    const k = Math.pow(10, precParams)

    return '' + parseFloat(Math[roundtag](parseFloat((nParams * k).toFixed(precParams * 2))).toFixed(precParams * 2)) / k
  }

  const s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')

  const re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + thousandsSep + '$2')
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
  }
  return s[1] === '' ? s[0] : s.join(decPoint)
}

/**
 * 关键词高亮
 * @param {String} content 内容
 * @param {Array} keywords 关键词列表，支持多个关键词
 * @param {Boolean} ignoreCase 是否忽略大小写
 * @param {String} pregTag 替换的前置tag
 * @param {String} closeTag 替换的闭合tag
 */
export function keywordHighlight (content, keywords = [], ignoreCase = true, pregTag = '<em class="highlight">', closeTag = '</em>') {
  if (keywords.length === 0) {
    return content
  }
  const reg = new RegExp(`(${keywords.join('|')})`, ignoreCase ? 'ig' : 'g')
  return content.replace(reg, pregTag + '$1' + closeTag)
}
