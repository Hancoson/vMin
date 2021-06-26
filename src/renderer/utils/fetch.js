/**
 * 该文件为示例，用户根据需要自行修改
 * 用户需要创建一个新的axios实例来使用，防止跟模板代码中的axios实例冲突
 */
import axios from 'axios'

import { Message } from 'element-ui'

// 创建一个 axios 实例
const service = axios.create({
  timeout: 10000, // 请求超时时间
  headers: { 'X-Requested-With': 'XMLHttpRequest' }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 不进行拦截请求
const noIntercept = ['/api/update']

// 响应拦截器
service.interceptors.response.use(
  ({ config, data: res }) => {
    // 这个状态码是和后端约定的
    const { code, toast = '服务器出错了', data } = res
    if (res.retcode === 'not_login') {
      errorCreat(res.message)
      window.parent.postMessage(
        {
          type: 'login'
        },
        '*'
      )
    }

    if (noIntercept.includes(config.url)) {
      return res
    }

    if (code === 0 || code === 200) {
      // [ 示例 ] code === 0 || 200 代表没有错误
      return data
    } else {
      Message.error(toast)
      return Promise.reject(toast)
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
