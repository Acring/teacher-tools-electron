import { IPingPresenter } from '../../../shared/presenter'

export class PingPresenter implements IPingPresenter {
  private pingCount = 0

  constructor() {
    console.log('🎾 PingPresenter initialized')
  }

  async ping(message: string): Promise<string> {
    this.pingCount++
    const timestamp = new Date().toLocaleString('zh-CN')

    console.log(`📡 [主进程] 收到 ping: ${message} (第${this.pingCount}次)`)

    // 模拟一些异步处理
    await new Promise((resolve) => setTimeout(resolve, 100))

    const response = `🏓 Pong! 收到你的消息: "${message}" - 时间: ${timestamp} - 计数: ${this.pingCount}`

    console.log(`📤 [主进程] 发送 pong: ${response}`)
    return response
  }

  async getPingCount(): Promise<number> {
    console.log(`📊 [主进程] 当前 ping 计数: ${this.pingCount}`)
    return this.pingCount
  }

  async resetPingCount(): Promise<void> {
    const oldCount = this.pingCount
    this.pingCount = 0
    console.log(`🔄 [主进程] ping 计数重置: ${oldCount} -> 0`)
  }
}
