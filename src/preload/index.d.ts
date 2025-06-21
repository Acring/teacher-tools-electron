import { ElectronAPI } from '@electron-toolkit/preload'

interface UpdaterMessage {
  type: 'checking-for-update' | 'update-available' | 'update-not-available' | 'error'
  message: string
  info?: unknown
  error?: string
}

interface API {
  checkForUpdates: () => void
  onUpdaterMessage: (callback: (message: UpdaterMessage) => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
