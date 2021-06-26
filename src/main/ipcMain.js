import { app, ipcMain, dialog, shell, remote } from 'electron'
import fs from 'fs'

//接收渲染进程广播数据
ipcMain.on('tomain', (event, data) => {
  console.log('111')
  //console.log(data)
  // app.exit()
})

/* ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
}) */

// 下载
ipcMain.on('save', (event, data, cb) => {
  const options = {
    defaultPath: `${app.getPath('documents')}${data}`
  }
  dialog.showSaveDialog(options, (path) => {
    fs.copyFile(data, path, (err) => {
      if (err) {
        dialog.showMessageBox({
          message: 'err',
          type: 'warning'
        })
      } else {
        // 保存成功
        //event.sender.send('save-reply', '1')
      }
      // file saved or err
    })
  })
})

// 消息通知
ipcMain.on('message', (event, data, link) => {
  dialog.showMessageBox(data, (e) => {
    link && e == 0 && shell.openExternal(link)
  })
})
