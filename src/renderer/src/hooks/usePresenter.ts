import { type IPresenter } from '../../../shared/presenter'

// 安全序列化函数
function safeSerialize(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => safeSerialize(item))
  }

  // 对于普通对象，只复制可序列化的属性
  const serialized: Record<string, unknown> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = (obj as Record<string, unknown>)[key]
      // 跳过函数、Symbol和其他不可序列化的值
      if (
        typeof value !== 'function' &&
        typeof value !== 'symbol' &&
        typeof value !== 'undefined'
      ) {
        serialized[key] = safeSerialize(value)
      }
    }
  }
  return serialized
}

// 创建单个 Presenter 的代理
function createProxy(
  presenterName: string
): Record<string, (...args: unknown[]) => Promise<unknown>> {
  return new Proxy({} as Record<string, (...args: unknown[]) => Promise<unknown>>, {
    get(_, functionName) {
      return (...payloads: unknown[]) => {
        console.log(
          `📡 [渲染进程] 调用: ${presenterName}.${String(functionName)}(${JSON.stringify(payloads).substring(0, 100)}...)`
        )

        try {
          const rawPayloads = payloads.map((e) => safeSerialize(e))
          return window.electron.ipcRenderer
            .invoke('presenter:call', presenterName, functionName, ...rawPayloads)
            .then((result) => {
              console.log(`📥 [渲染进程] 收到结果:`, result)
              return result
            })
            .catch((e: Error) => {
              console.warn('❌ [渲染进程] 调用失败:', String(functionName), e)
              throw e
            })
        } catch (error) {
          console.warn('❌ [渲染进程] 序列化失败:', String(functionName), error)
          throw error
        }
      }
    }
  })
}

// 创建所有 Presenter 的代理
const presentersProxy: IPresenter = new Proxy({} as IPresenter, {
  get(_, presenterName) {
    return createProxy(presenterName as string)
  }
})

/**
 * React Hook for accessing Presenter methods
 *
 * @param name - The name of the presenter to access
 * @returns The presenter proxy with typed methods
 *
 * @example
 * ```tsx
 * const pingPresenter = usePresenter('pingPresenter')
 *
 * const handleClick = async () => {
 *   const result = await pingPresenter.ping('Hello!')
 *   console.log(result)
 * }
 * ```
 */
export function usePresenter<T extends keyof IPresenter>(name: T): IPresenter[T] {
  return presentersProxy[name]
}
