import { app, BrowserWindow, ipcMain } from 'electron'

// 引入ipMain

// import { updateHandle } from './updater.js'

// 百度统计
import baiduTongji from 'electron-baidu-tongji'
const { ebtMain } = baiduTongji
ebtMain(ipcMain, true)

//const feedUrl = 'https://issuecdn.baidupcs.com/issue/netdisk/MACguanjia/BaiduNetdisk_mac_3.6.5.dmg'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 700,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      enableremotemodule: true,
      nodeIntegration: true
    }
  })
  //new BrowserWindow.addDevToolsExtension('node_modules/vue-devtools/vender')

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 引入ipMain
  require('./ipcMain')

  // TODO release 包开启debug
  // mainWindow.webContents.openDevTools()

  //检测版本更新
  // updateHandle(mainWindow, feedUrl)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
