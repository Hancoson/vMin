import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/**
 * 重写 push 方法，避免控制台抛出未捕获 reject 错误
 * https://juejin.im/post/5d80d961f265da03ca11a1d9
 */
const originalPush = Router.prototype.push

Router.prototype.push = function push(location, onResolve, onReject) {
  return onResolve || onReject
    ? originalPush.call(this, location, onResolve, onReject)
    : originalPush.call(this, location).catch((err) => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home-page',
      component: require('@/views/Home').default
    },
    {
      path: '/lossless',
      name: 'lossless-page',
      component: require('@/views/Home').default
    },
    {
      path: '/webp',
      name: 'webp-page',
      component: require('@/views/Home').default
    },
    {
      path: '/about',
      name: 'about-page',
      component: require('@/views/About').default
    }
  ]
})
