/**
 * 文件操作
 */
import fs from 'fs'
import path from 'path'
import ZIP from 'adm-zip'

// 获取真实的绝对路径
const dirPathO = path.join(__dirname).split('Resources')
const relativePath = dirPathO[0]

const TEMP =
  process.env.NODE_ENV === 'production' ? relativePath + 'd/' : './d/'
// const TEMP = './d/'
const TEMP_MIN = TEMP + '/b'
const TEMP_ZIP = TEMP + '/vmin.zip'
// 文件夹下的所有文件和文件夹
const delDir = (path) => {
  let files = []
  if (fsExistsSync(path)) {
    if (fs.existsSync(path)) {
      files = fs.readdirSync(path)
      files.forEach((file, index) => {
        let curPath = path + '/' + file
        if (fs.statSync(curPath).isDirectory()) {
          delDir(curPath) //递归删除文件夹
        } else {
          fs.unlinkSync(curPath) //删除文件
        }
      })
      fs.rmdirSync(path)
    }
  }
}

//检测文件或者文件夹存在
const fsExistsSync = (path) => {
  try {
    fs.accessSync(path, fs.F_OK)
  } catch (e) {
    return false
  }
  return true
}

// 创建文件夹
const mkdir = (path) => {
  if (!fsExistsSync(path)) {
    fs.mkdirSync(path, '0755')
  }
}

// 删除临时目录
delDir(TEMP)
// 创建临时目录
mkdir(TEMP)
mkdir(TEMP_MIN)

// 复制文件
const copyFile = (srcPath, tarPath, cb) => {
  fs.copyFile(srcPath, tarPath, (err) => {
    if (err) {
      console.log('copy file err', err)
    } else {
      console.log('copy file succeed')
    }
    cb(err)
  })
}

// 压缩gzip
const gzip = (path, zipPath) => {
  const zip = new ZIP()
  zip.addLocalFolder(path)
  zip.writeZip(zipPath)
}

export default { TEMP, TEMP_MIN, TEMP_ZIP, delDir, mkdir, copyFile, gzip }
