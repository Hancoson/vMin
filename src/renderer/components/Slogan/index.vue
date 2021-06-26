<template>
  <div class="v-slogan">
    <p>
      {{ txt }}
    </p>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      isCollapse: true,
      version: window.__CONFIG.version,
      txt: "图片有损压缩",
    };
  },
  computed: {
    ...mapState({
      format: (state) => state.format,
    }),
  },
  watch: {
    format(n, o) {
      const that = this;
      switch (n) {
        case 1:
          that.txt = "图片有损压缩";
          break;

        case 2:
          that.txt = "图片无损压缩";
          break;

        case 3:
          that.txt = "转WebP";
          break;

        case 4:
          that.txt = "图片裁剪";
          break;

        case 5:
          that.txt = "视频压缩";
          break;

        case 6:
          that.txt = "关于";
          break;

        default:
          break;
      }
    },
  },
};
</script>
<style lang="scss">
.v-slogan {
  position: fixed;
  z-index: 2;
  top: 0;
  right: 0;
  > p {
    font-size: 40px;
    font-weight: 900;
    padding: 20px;
    color: #333;
    opacity: 0.2;
  }
}
</style>
