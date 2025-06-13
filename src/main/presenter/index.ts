import { ipcMain } from 'electron'
import { IPresenter } from '../../shared/presenter'
import { PingPresenter } from './pingPresenter'

export class Presenter implements IPresenter {
  pingPresenter: PingPresenter

  constructor() {
    console.log('🚀 Presenter 系统初始化中...')

    // 初始化所有子 Presenter
    this.pingPresenter = new PingPresenter()

    console.log('✅ 所有 Presenter 初始化完成')

    this.init()
  }

  private init(): void {
    console.log('🔧 注册 IPC 处理器...')

    // 注册统一的 IPC 处理器
    ipcMain.handle(
      'presenter:call',
      async (_event, presenterName: string, methodName: string, ...payloads: unknown[]) => {
        try {
          console.log(
            `🔧 [IPC] 调用: ${presenterName}.${methodName}(${JSON.stringify(payloads).substring(0, 100)}...)`
          )

          // 获取对应的 presenter
          const presenter = this[presenterName as keyof IPresenter]
          if (!presenter) {
            throw new Error(`Presenter "${presenterName}" not found`)
          }

          // 检查方法是否存在
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (typeof (presenter as any)[methodName] !== 'function') {
            throw new Error(`Method "${methodName}" not found on "${presenterName}"`)
          }

          // 调用方法并获取结果
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result = await (presenter as any)[methodName](...payloads)
          console.log(`✅ [IPC] 结果: ${JSON.stringify(result).substring(0, 100)}...`)
          return result
        } catch (error) {
          console.error(`❌ [IPC] 错误:`, error)
          throw error
        }
      }
    )

    console.log('✅ IPC 处理器注册完成')
  }
}
