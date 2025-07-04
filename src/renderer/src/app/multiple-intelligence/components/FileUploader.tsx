import { useRef } from 'react'
// import { downloadSampleFile } from '../utils/sample-data'

interface FileUploaderProps {
  isLoading: boolean
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClearData: () => void
  addLog: (message: string) => void
}

export default function FileUploader({
  isLoading,
  onFileUpload,
  onClearData
  // addLog
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClearData = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClearData()
  }

  // const handleDownloadSample = () => {
  //   const success = downloadSampleFile()
  //   if (success) {
  //     addLog('示例文件生成成功')
  //   } else {
  //     addLog('示例文件生成失败')
  //   }
  // }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">数据导入</h2>
      <div className="flex flex-wrap gap-4 items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={onFileUpload}
          disabled={isLoading}
          className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
        {isLoading && <span className="text-purple-600">📊 解析中...</span>}
        {/* <button
          onClick={handleDownloadSample}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          📄 下载示例文件
        </button> */}
        <button
          onClick={handleClearData}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          🗑️ 清空数据
        </button>
      </div>
    </div>
  )
}
