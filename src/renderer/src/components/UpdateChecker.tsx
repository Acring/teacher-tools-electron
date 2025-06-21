import React, { useState, useEffect } from 'react'
import { Download, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'

interface UpdaterMessage {
  type: 'checking-for-update' | 'update-available' | 'update-not-available' | 'error'
  message: string
  info?: unknown
  error?: string
}

const UpdateChecker: React.FC = () => {
  const [updateStatus, setUpdateStatus] = useState<UpdaterMessage | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    // 监听更新消息
    const cleanup = window.api.onUpdaterMessage((message: UpdaterMessage) => {
      setUpdateStatus(message)
      setIsChecking(false)
    })

    return cleanup
  }, [])

  const handleCheckUpdate = () => {
    setIsChecking(true)
    setUpdateStatus(null)
    window.api.checkForUpdates()
  }

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'checking-for-update':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
      case 'update-available':
        return <Download className="w-4 h-4 text-green-500" />
      case 'update-not-available':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'checking-for-update':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'update-available':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'update-not-available':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleCheckUpdate}
        disabled={isChecking}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
        {isChecking ? '检查中...' : '检查更新'}
      </button>

      {updateStatus && (
        <div
          className={`flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md ${getStatusColor(updateStatus.type)}`}
        >
          {getStatusIcon(updateStatus.type)}
          <span>{updateStatus.message}</span>
          {updateStatus.error && <span className="text-xs opacity-70">({updateStatus.error})</span>}
        </div>
      )}
    </div>
  )
}

export default UpdateChecker
