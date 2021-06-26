<template>
  <el-upload
    class="upload-box"
    drag
    action=""
    :accept="accept"
    :before-upload="beforeUpload"
    multiple
  >
    <div :class="['bg', filesList.length > 0 ? 'top250' : 'top2501']">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
        <p class="el-upload__tip">
          支持图片
          <el-tooltip
            class="item"
            effect="dark"
            :content="format == 3 ? 'jpg/png' : 'jpg/jpeg/gif/png/svg'"
            placement="top"
          >
            <span style="text-decoration: underline">格式</span>
          </el-tooltip>
          ，大小不超过1GB<br />
          <i v-if="format == 2" style="color: #f56c6c"
            >部分无损压缩时间比较久，请耐心等待</i
          >
        </p>
      </div>
    </div>
  </el-upload>
</template>
<script>
import fs from "fs";
import Path from "path";
import store from "@/store";
import { files } from "@/utils";
import { mapState } from "vuex";

import imagemin from "imagemin";
import imageminGifsicle from "imagemin-gifsicle"; //无损压缩
import imageminOptipng from "imagemin-optipng"; //无损压缩
import imageminJpegtran from "imagemin-jpegtran"; //无损压缩

import imageminMozjpeg from "imagemin-mozjpeg"; //有损压缩
import imageminGiflossy from "imagemin-giflossy"; //有损压缩
import imageminPngquant from "imagemin-pngquant"; //有损压缩

import imageminSvgo from "imagemin-svgo";
import imageminWebp from "imagemin-webp";

export default {
  data() {
    return {
      accept: "image/*",
    };
  },
  computed: {
    ...mapState({
      filesList: (state) => state.filesList,
      format: (state) => state.format,
    }),
  },
  watch: {
    format(n, o) {
      if (n === 3) {
        this.accept = ".png,.jpg,.jpeg";
      } else {
        this.accept = "image/*";
      }
      // 清空
      this.clear();
    },
  },
  methods: {
    async compress(file) {
      const that = this;
      let _f = {};
      let _plugins = [];
      let _newName = null;
      const format = that.format; //1--有损，2--无损，3--转webp
      const { name, path, size, type } = file;
      const extname = Path.extname(file.name);
      _f.name = name;
      _f.size = size;
      _f.type = type;
      store.commit("setLoading", true);
      // 压缩图片
      switch (extname) {
        case ".jpeg":
        case ".jpg":
          _plugins.push(
            format == 1
              ? imageminMozjpeg({
                  quality: 75, //压缩质量，在0（最差）到100（完美）范围内
                  progressive: true, //渐进式图片
                  //trellis:true, //网格优化
                })
              : imageminJpegtran({
                  progressive: true,
                  arithmetic: false,
                })
          );
          break;

        case ".png":
          _plugins.push(
            format == 1
              ? imageminPngquant({
                  strip: true,
                  quality: [0.7, 0.8],
                })
              : imageminOptipng({
                  optimizationLevel: 4,
                  interlaced: null,
                })
          );
          break;

        case ".gif":
          _plugins.push(
            format == 1
              ? imageminGiflossy({
                  optimizationLevel: 2,
                  lossy: 50, //30 is very light compression, 200 is heavy
                })
              : imageminGifsicle({
                  optimizationLevel: 2,
                })
          );
          break;

        case ".svg":
          _plugins.push(
            imageminSvgo({
              plugins: [
                {
                  removeViewBox: false, //尽可能删除viewBox属性s
                  cleanupIDs: true, //删除未使用的ID并缩小已用ID
                },
              ],
            })
          );
          break;
        case ".webp":
          // 转webp
          _plugins.push(imageminWebp({ quality: 75 }));
          _newName = _f.name.replace(/.[^/.]+$/, ".webp");
          break;

        default:
          break;
      }
      const res = await imagemin([files.TEMP + _f.name], {
        destination: files.TEMP + "b",
        plugins: _plugins,
      });

      store.commit("setLoading", false);
      if (!res || !res[0]) {
        this.$message.error("压缩失败，文件名称包含特殊字符！");
        return;
      }
      _f.path = files.TEMP + "b/" + (_newName || _f.name);
      _f.newSize = fs.statSync(res[0].destinationPath).size;
      store.commit("setFilesList", _f);
    },
    beforeUpload(file) {
      const that = this;
      const { name, path, size, type } = file;

      if (!file) {
        this.$message.error("请正确上传文件！");
        return false;
      }
      if (!(type.includes("video/") || type.includes("image/"))) {
        this.$message.error("仅支持图片或视频！");
        return false;
      }

      if (size >= 1024 * 1000 * 1000) {
        this.$message.error("上传失败，文件过大！");
        return false;
      }
      files.copyFile(path, files.TEMP + name, (e) => {
        if (!e) {
          that.compress(file);
        }
      });
      return false;
    },
    clear() {
      // 删除临时文件
      files.delDir(files.TEMP);
      files.mkdir(files.TEMP);
      files.mkdir(files.TEMP_MIN);
      store.commit("setFilesList", 0);
    },
  },
};
</script>
<style lang="scss">
.upload-box {
  width: 100%;
  height: 100%;
  text-align: center;
  //margin-top: 250px;
  .el-upload {
    width: 100%;
  }
  .el-upload-dragger {
    width: 100%;
    height: 100%;
    background: transparent !important;
    border: 0;
  }
  .bg {
    width: 360px;
    height: 200px;
    border-radius: 10px;
    margin: 250px auto;
    box-shadow: 0px -1px 15px #efefef;
    background-color: rgba(255, 255, 255, 0.82);
  }
  .top250 {
    animation: move 1s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  }

  .top2501 {
    animation: move1 1s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  }
}

@keyframes move {
  0% {
    margin-top: 250px;
  }
  100% {
    margin-top: 100px;
  }
}
@keyframes move1 {
  0% {
    margin-top: 100px;
  }
  100% {
    margin-top: 250px;
  }
}
</style>
<style>
.el-icon-upload {
  animation: scale 1s ease-out;
  animation-iteration-count: infinite;
}
@keyframes scale {
  0% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.07, 1.07);
  }
  100% {
    transform: scale(1, 1);
  }
}
</style>
