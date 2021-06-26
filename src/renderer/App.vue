<template>
  <div id="app">
    <div id="bg"></div>
    <keep-alive>
      <router-view />
    </keep-alive>
    <v-menu></v-menu>
    <v-slogan></v-slogan>
    <!-- <v-update></v-update> -->
  </div>
</template>

<script>
import API from "@/api";
import store from "@/store";
import vMenu from "@/components/Menu";
import vSlogan from "@/components/Slogan";
//import vUpdate from '@/components/Update'
export default {
  name: "v-min",
  components: {
    vMenu,
    vSlogan,
    //vUpdate
  },
  mounted() {
    this.getUpdate();
  },
  methods: {
    async getUpdate() {
      const res = await API.update({});
      if (
        res &&
        +res.version.replace(".", "") >
          +window.__CONFIG.version.replace(".", "")
      ) {
        store.commit("setUpdateInfo", res);
      }
    },
  },
};
</script>
<style lang="scss">
/* CSS */
body {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
}
* {
  margin: 0;
  padding: 0;
}

.fl {
  float: left;
}
.fr {
  float: right;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#app {
  position: relative;
  #bg {
    position: fixed;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: translate3d(0, 0, 0);
    background-position: center;
    background-size: cover;
    background-image: url("~@/assets/bg.jpg");
    background-attachment: fixed;
    filter: blur(6px);
  }
  #wrapper {
    //width: 780px;
    //margin: 100px auto 60px;
    position: relative;
    z-index: 5;
  }
}
</style>
