import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png?asset'
import { Presenter } from './presenter'

// 配置自动更新器
autoUpdater.autoDownload = false // 禁用自动下载
autoUpdater.autoInstallOnAppQuit = false // 禁用退出时自动安装

function createWindow(): BrowserWindow {
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

  return mainWindow
}

// 设置更新检查逻辑
function setupAutoUpdater(mainWindow: BrowserWindow): void {
  // 检查更新
  autoUpdater.on('checking-for-update', () => {
    console.log('正在检查更新...')
    mainWindow.webContents.send('updater-message', {
      type: 'checking-for-update',
      message: '正在检查更新...'
    })
  })

  // 发现可用更新
  autoUpdater.on('update-available', (info) => {
    console.log('发现可用更新:', info)
    mainWindow.webContents.send('updater-message', {
      type: 'update-available',
      message: `发现新版本 ${info.version}`,
      info
    })

    // 显示更新对话框
    const choice = dialog.showMessageBoxSync(mainWindow, {
      type: 'info',
      buttons: ['立即更新', '稍后提醒'],
      defaultId: 0,
      title: '发现新版本',
      message: `发现新版本 ${info.version}`,
      detail: '由于应用未签名，需要手动下载更新。点击"立即更新"将打开GitHub发布页面。'
    })

    if (choice === 0) {
      // 打开GitHub release页面
      const repoUrl = 'https://github.com/acring/teacher-tools-electron'
      const releaseUrl = `${repoUrl}/releases/latest`
      shell.openExternal(releaseUrl)
    }
  })

  // 当前已是最新版本
  autoUpdater.on('update-not-available', (info) => {
    console.log('当前已是最新版本:', info)
    mainWindow.webContents.send('updater-message', {
      type: 'update-not-available',
      message: '当前已是最新版本'
    })
  })

  // 更新检查出错
  autoUpdater.on('error', (err) => {
    console.error('更新检查出错:', err)
    mainWindow.webContents.send('updater-message', {
      type: 'error',
      message: '更新检查失败',
      error: err.message
    })
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

  // 处理手动检查更新的IPC
  ipcMain.on('check-for-updates', () => {
    console.log('手动检查更新')
    autoUpdater.checkForUpdates()
  })

  // 初始化 Presenter 系统
  new Presenter()

  const mainWindow = createWindow()

  // 设置自动更新器
  setupAutoUpdater(mainWindow)

  // 在生产环境下启动时检查更新
  if (!is.dev) {
    // 延迟5秒后检查更新，避免启动时的卡顿
    setTimeout(() => {
      autoUpdater.checkForUpdates()
    }, 5000)
  }

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
