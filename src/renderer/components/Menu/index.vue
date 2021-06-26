<template>
  <div class="v-menu">
    <el-menu
      default-active="1"
      @select="handleSelect"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
    >
      <el-menu-item index="1">
        <i class="el-icon-picture-outline-round"></i>
        <span slot="title">有损压缩</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-picture-outline"></i>
        <span slot="title">无损压缩</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-star-off"></i>
        <span slot="title">转WebP</span>
      </el-menu-item>
      <el-menu-item index="4" disabled>
        <i class="el-icon-scissors"></i>
        <span slot="title">图片裁剪</span>
      </el-menu-item>
      <el-menu-item index="5" disabled>
        <i class="el-icon-video-camera-solid"></i>
        <span slot="title">视频压缩</span>
      </el-menu-item>
      <el-menu-item index="6" link>
        <el-badge value="new" class="item" v-if="!!updateInfo"></el-badge>
        <i class="el-icon-question"></i>
        <span slot="title">关于</span>
      </el-menu-item>
    </el-menu>
    <p class="bottom">v{{ version }}</p>
  </div>
</template>

<script>
import store from "@/store";
import { mapState } from "vuex";
export default {
  data() {
    return {
      isCollapse: true,
      version: window.__CONFIG.version,
    };
  },
  computed: {
    ...mapState({
      updateInfo: (state) => state.updateInfo,
    }),
  },
  methods: {
    handleSelect(key) {
      const that = this;
      store.commit("setFormat", +key);
      switch (+key) {
        case 1:
          that.$router.push("/");
          break;
        case 2:
          that.$router.push("/lossless");
          break;
        case 3:
          that.$router.push("/webp");
          break;
        case 6:
          that.$router.push("/about");
          break;

        default:
          break;
      }
    },
  },
};
</script>
<style lang="scss">
.v-menu {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 65px;
  height: 100%;
  background: rgba(255, 255, 255, 0.75);
  .el-menu {
    background: transparent;
    border: 0;
    .el-menu-item [class^="el-icon-"],
    .el-submenu > .el-submenu__title [class^="el-icon-"] {
      margin-top: 18px !important;
    }
    > li {
      position: relative;
      .item {
        position: absolute;
        top: 10px;
        right: 0;
        > sup {
          font-size: 10px;
          height: 12px;
          line-height: 10px;
          padding: 0 4px;
        }
      }
    }
  }
  .bottom {
    position: absolute;
    bottom: 10px;
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #c7c7c7;
  }
}
</style>
