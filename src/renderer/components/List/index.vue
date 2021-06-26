<template>
  <div :class="['files-list', filesList.length > 0 ? 'top250' : 'top2501']">
    <el-table
      v-if="filesList.length > 0"
      stripe
      :show-header="false"
      :data="filesList"
      :empty-text="' '"
      style="width: 100%"
    >
      <el-table-column prop="name" label="名称">
        <template slot-scope="scope">
          <p class="ellipsis">{{ scope.row.name }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="110"> </el-table-column>
      <el-table-column label="大小变化" width="180">
        <template slot-scope="scope">
          <div class="num fl">{{ scope.row.size | fileSize }}</div>
          <i class="icon el-icon-right"></i>
          <div class="num fl">{{ scope.row.newSize | fileSize }}</div>
        </template>
      </el-table-column>
      <el-table-column label="压缩比" width="80">
        <template slot-scope="scope">
          <b>{{ proportion(scope.row) }}</b>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-download"
            circle
            @click="download(scope.$index)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="loading">
      <template v-if="showLoading">
        <i class="el-icon-loading"></i><span>正在压缩，请稍等</span>
      </template>
    </div>
    <el-row class="bottom-bts" v-if="filesList.length > 1">
      <el-button type="info" round icon="el-icon-delete" @click="clear()"
        >清空列表</el-button
      >
      <el-button
        type="primary"
        round
        icon="el-icon-download"
        @click="downloadAll()"
        >下载所有</el-button
      >
    </el-row>
  </div>
</template>
<script>
import store from "@/store";
import { ipcRenderer } from "electron";
import { mapState } from "vuex";
import { tools, files } from "@/utils";
export default {
  computed: {
    ...mapState({
      filesList: (state) => state.filesList,
      showLoading: (state) => state.showLoading,
    }),
  },
  methods: {
    download(idx) {
      const that = this;
      const path = that.filesList[idx].path;
      ipcRenderer.send("save", path);
      // 接收消息
      ipcRenderer.on("save-reply", function (event, arg) {
        if (arg) {
          that.$message.success("保存成功");
        }
      });
    },
    proportion(row) {
      const n = row.newSize;
      const o = row.size;
      let res = tools.formatNumber(((o - n) / o) * 100, 0);
      if (res < 0) {
        return "+" + Math.abs(res) + "%";
      } else {
        return "-" + res + "%";
      }
    },
    downloadAll() {
      const that = this;
      const path = files.TEMP + "b";
      files.gzip(files.TEMP + "b", files.TEMP_ZIP);
      setTimeout(() => {
        ipcRenderer.send("save", files.TEMP_ZIP);
        // 接收消息
        ipcRenderer.on("save-reply", function (event, arg) {
          if (arg) {
            that.$message.success("保存成功");
          }
        });
      }, 50);
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
<style lang="scss" scoped>
.files-list {
  position: absolute;
  left: 50%;
  top: 300px;
  width: 780px;
  margin: 20px 0 100px -390px;

  &.top250 {
    animation: move 1s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  }

  &.top2501 {
    animation: move1 1s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  }
  .el-table {
    background: transparent;
    button {
      font-size: 12px;
    }
  }
  .num {
    color: #67c23a;
    width: 70px;
    text-align: center;
  }
  .icon {
    float: left;
    font-size: 16px;
    margin-top: 3px;
  }
  .bottom-bts {
    margin-top: 20px;
    text-align: center;
  }
  .loading {
    width: 100%;
    height: 36px;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
    position: relative;
    z-index: 2;
    i {
      line-height: 36px;
      font-size: 18px;
    }
    span {
      display: inline-block;
      margin-top: -3px;
      color: #333;
    }
  }
}

@keyframes move {
  0% {
    top: 450px;
  }
  100% {
    top: 300px;
  }
}
@keyframes move1 {
  0% {
    top: 300px;
  }
  100% {
    top: 450px;
  }
}
</style>
<style>
.el-table::before {
  background-color: transparent !important;
}
.el-table td {
  padding: 6px 0 !important;
  font-size: 12px !important;
}
.el-button--mini.is-circle {
  padding: 5px !important;
}
.el-table td {
  border: 0 !important;
}
.el-table--striped .el-table__body tr.el-table__row--striped td {
  background: rgba(250, 250, 250, 0.55) !important;
}
.el-table th,
.el-table tr {
  background-color: rgba(250, 250, 250, 0.82) !important;
}
</style>
