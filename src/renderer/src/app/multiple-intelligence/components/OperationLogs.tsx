interface OperationLogsProps {
  logs: string[]
}

export default function OperationLogs({ logs }: OperationLogsProps) {
  if (logs.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">操作日志</h2>
      <div className="bg-gray-50 rounded-md p-4 max-h-40 overflow-y-auto">
        <div className="space-y-1">
          {logs.map((log, index) => (
            <div key={index} className="text-sm text-gray-700 font-mono">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
