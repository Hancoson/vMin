<template>
  <div id="">
    <el-dialog
      title="正在更新新版本,请稍候..."
      :visible.sync="dialogVisible"
      width="60%"
      :close-on-click-modal="closeOnClickModal"
      :close-on-press-escape="closeOnPressEscape"
      :show-close="showClose"
      center
    >
      <div
        style="width: 100%; height: 20vh; line-height: 20vh; text-align: center"
      >
        <el-progress
          status="success"
          :text-inside="true"
          :stroke-width="20"
          :percentage="percentage"
          :width="strokeWidth"
          :show-text="true"
        ></el-progress>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ipcRenderer } from "electron";
const that = this;
//接收主进程版本更新消息
ipcRenderer.on("message", (event, arg) => {
  // for (var i = 0; i < arg.length; i++) {
  console.log(arg);
  if ("update-available" == arg.cmd) {
    //显示升级对话框
    that.dialogVisible = true;
  } else if ("download-progress" == arg.cmd) {
    //更新升级进度
    /**
     * 
     * message{bytesPerSecond: 47673
      delta: 48960
      percent: 0.11438799862426002
      total: 42801693
      transferred: 48960
      }
     */
    console.log(arg.message.percent);
    let percent = Math.round(parseFloat(arg.message.percent));
    that.percentage = percent;
  } else if ("error" == arg.cmd) {
    that.dialogVisible = false;
    that.$message("更新失败");
  }
  // }
});
//20秒后开始检测新版本
let timeOut = window.setTimeout(() => {
  console.log(11111);
  ipcRenderer.send("checkForUpdate");
}, 2000);
clearTimeout;
//间隔1小时检测一次
let interval = window.setInterval(() => {
  console.log(2222);
  ipcRenderer.send("checkForUpdate");
}, 5000);

export default {
  name: "app",
  data() {
    return {
      dialogVisible: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: false,
      percentage: 0,
      strokeWidth: 200,
    };
  },
  mounted() {},
  destroyed() {
    window.clearInterval(interval);
    window.clearInterval(timeOut);
  },
};
</script>
