import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    filesList: [],
    showLoading: false,
    format: 1, //1:图片有损压缩，2:图片无损压缩，3:转webP
    updateInfo: null
  },
  mutations: {
    setFilesList(state, param) {
      if (param) {
        state.filesList.push(param)
      } else {
        state.filesList = []
      }
    },
    setLoading(state, param) {
      state.showLoading = param
    },
    setFormat(state, param) {
      state.format = param
    },
    setUpdateInfo(state, param) {
      state.updateInfo = param
    }
  },
  actions: {}
})
