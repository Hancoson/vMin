<template>
  <div id="wrapper">
    <header>
      <img src="@/assets/logo.png" />
      <h1>vMin</h1>
      <h5>图片压缩、转WebP、裁剪，视频压缩工具</h5>
    </header>
    <div class="about">
      <el-button size="mini" round @click="check()">检查更新</el-button>
      <p>版本：v{{ version }}</p>
      <p>Copyright &copy; 2021 Hancoson</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ipcRenderer } from "electron";
import { tools } from "@/utils";
export default {
  name: "about-page",
  components: {},
  data() {
    return {
      version: window.__CONFIG.version,
    };
  },
  computed: {
    ...mapState({
      updateInfo: (state) => state.updateInfo,
    }),
  },
  mounted() {},
  methods: {
    check() {
      const that = this;
      const info = that.updateInfo;
      const os = tools.getOS();
      let data = {};
      if (
        info &&
        info.version.replace(".", "") >
          +window.__CONFIG.version.replace(".", "")
      ) {
        data = {
          title: "更新说明",
          message: `说明：${info.context}，版本：v${info.version}，大小：${info[os].size}`,
          buttons: ["更新", "取消"],
          cancelId: 1,
        };
        ipcRenderer.send("message", data, info[os].url);
      } else {
        data = {
          title: "更新说明",
          message: `您已经是最新版本啦~`,
          buttons: ["取消"],
        };
        ipcRenderer.send("message", data);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
#wrapper {
  color: #f7f7f7;
  text-align: center;
  header {
    margin-top: 100px;
    img {
      width: 100px;
      height: 100px;
    }
    h1 {
      margin: 20px 0 10px;
    }
  }
  .about {
    margin-top: 30px;
    font-size: 12px;
    line-height: 2;
  }
}
</style>
