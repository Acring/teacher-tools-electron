import { InfoIcon } from 'lucide-react'
import { useRef, useState } from 'react'

interface BatchOperationsProps {
  studentCount: number
  onImportSample: () => void
  onExportData: () => void
  onImportData: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClearAll: () => void
}

export default function BatchOperations({
  studentCount,
  onImportSample,
  onExportData,
  onImportData,
  onClearAll
}: BatchOperationsProps) {
  // Excel 导入相关
  const excelInputRef = useRef<HTMLInputElement>(null)
  const [showExcelTip, setShowExcelTip] = useState(false)

  const handleExcelClick = () => {
    excelInputRef.current?.click()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="text-xl mr-2">🚀</span>
        批量操作
      </h2>
      <div className="space-y-2">
        <button
          onClick={onImportSample}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          📄 导入示例数据
        </button>
        <button
          onClick={onExportData}
          disabled={studentCount === 0}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          📤 导出 JSON 数据
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
            onClick={handleExcelClick}
          >
            📥 导入 Excel 学生名单
          </button>
          <button
            type="button"
            className="flex items-center justify-center flex-nowrap px-2 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            onClick={() => setShowExcelTip(true)}
          >
            <InfoIcon className="w-4 h-4" />
          </button>
        </div>
        <input
          type="file"
          accept=".xlsx,.xls"
          ref={excelInputRef}
          className="hidden"
          onChange={(e) => {
            // 交由父组件处理
            if (e.target.files && e.target.files[0]) {
              // 只传递 event，类型区分在父组件处理
              onImportData(e)
            }
          }}
        />
        <button
          onClick={onClearAll}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          🗑️ 清空所有数据
        </button>
      </div>
      {/* Excel 格式说明弹窗 */}
      {showExcelTip && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowExcelTip(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-2">支持的 Excel 导入格式</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <div>1. 推荐包含表头，表头中“姓名”字段可为“姓名”“名字”“Name”“name”等。</div>
              <div>
                2.
                如果没有表头，系统会默认把第一列当作姓名，第二列当作学号（可选），第三列当作标签（可选）。
              </div>
              <div>3. 标签请用逗号或分号分隔。</div>
              <div className="bg-gray-100 rounded p-2 mt-2">
                <div>示例（有表头）：</div>
                <pre className="whitespace-pre-wrap text-xs">
                  {`姓名, 学号, 标签
张三, 20230001, 活跃,守纪
李四, 20230002, 安静`}
                </pre>
                <br />
                <br />
                <div className="mt-2">示例（无表头）：</div>
                <pre className="whitespace-pre-wrap text-xs">
                  {`张三, 20230001, 活跃,守纪
李四, 20230002, 安静`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
