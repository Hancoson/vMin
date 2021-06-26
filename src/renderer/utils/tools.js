/**
 * 包大小过滤器
 * @param {*} size
 */
const fileSize = (size) => {
  if (size > 1024000000) {
    return parseFloat((size / 1024000000).toFixed(1)) + 'G'
  } else if (size > 1024000) {
    return parseFloat((size / 1024000).toFixed(1)) + 'M'
  } else {
    return (size / 1000).toFixed(1) + 'KB'
  }
}

const formatNumber = (value, n = 1) => {
  return parseFloat(value.toFixed(n))
}

const getOS = () => {
  var isWin = navigator.platform == 'Win32' || navigator.platform == 'Windows'
  var isMac =
    navigator.platform == 'Mac68K' ||
    navigator.platform == 'MacPPC' ||
    navigator.platform == 'Macintosh' ||
    navigator.platform == 'MacIntel'
  if (isMac) return 'mac'
  var isUnix = navigator.platform == 'X11' && !isWin && !isMac
  if (isUnix) return 'unix'
  var isLinux = String(navigator.platform).indexOf('Linux') > -1
  if (isLinux) return 'linux'
  if (isWin) return 'win'
  return 'other'
}

export default { fileSize, formatNumber, getOS }
