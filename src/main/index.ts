import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { Presenter } from './presenter'
import { autoUpdater } from 'electron-updater'
import { dialog } from 'electron'
import log from 'electron-log'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function setupAutoUpdater() {
  autoUpdater.logger = log
  if (log.transports && log.transports.file) {
    log.transports.file.level = 'info'
  }

  // 配置更新器选项，禁用严格的签名验证
  autoUpdater.allowPrerelease = false
  autoUpdater.allowDowngrade = false

  // 对于开发和测试环境，可以跳过签名验证
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    autoUpdater.forceDevUpdateConfig = true
  }

  // 检查更新
  autoUpdater.checkForUpdatesAndNotify()

  // 监听有新版本
  autoUpdater.on('update-available', (info) => {
    let notes = ''
    if (Array.isArray(info.releaseNotes)) {
      notes = info.releaseNotes.map((note) => note.note).join('\n')
    } else {
      notes = info.releaseNotes || ''
    }
    dialog.showMessageBox({
      type: 'info',
      title: '发现新版本',
      message: `检测到新版本 v${info.version}，正在后台下载...`,
      detail: notes
    })
  })

  // 下载完成
  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: '更新已下载',
        message: '新版本已下载，是否立即重启应用以应用更新？',
        buttons: ['现在重启', '稍后']
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall()
        }
      })
  })

  autoUpdater.on('error', (err) => {
    console.error('AutoUpdater error:', err)
    log.error('AutoUpdater error:', err)

    // 检查是否为签名相关错误
    const errorMessage = err?.message || err?.toString() || 'unknown'

    if (
      errorMessage.includes('not signed by application owner') ||
      errorMessage.includes('signature verification failed')
    ) {
      dialog.showErrorBox(
        '签名验证失败',
        `更新失败：应用签名验证出现问题。\n\n` +
          `这可能是由于:\n` +
          `1. 应用未正确签名\n` +
          `2. 证书过期或无效\n` +
          `3. 系统安全设置过于严格\n\n` +
          `请联系开发者或稍后重试。\n\n` +
          `详细错误: ${errorMessage}`
      )
    } else {
      dialog.showErrorBox('更新出错', `更新过程中出现错误:\n\n${errorMessage}`)
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // 初始化 Presenter 系统
  new Presenter()

  setupAutoUpdater()

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
