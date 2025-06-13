// 共享的 Presenter 接口定义

// 示例：Ping Presenter 接口
export interface IPingPresenter {
  ping(message: string): Promise<string>
  getPingCount(): Promise<number>
  resetPingCount(): Promise<void>
}

// 主 Presenter 接口 - 在这里添加所有的 presenter
export interface IPresenter {
  pingPresenter: IPingPresenter
  // 添加更多 presenter 接口...
}
