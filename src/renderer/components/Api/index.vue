import fetch from '@/utils/fetch'
const URL = 'http://xx.xyz/api/xpnchs!75/api'
export default {
  // 领取福利
  update(params) {
    return fetch({
      url: URL + '/update',
      method: 'get',
      params,
      acceptError: true
    })
  }
}
