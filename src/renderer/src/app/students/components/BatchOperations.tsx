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
        <div>
          <input
            type="file"
            accept=".json"
            onChange={onImportData}
            className="hidden"
            id="import-file"
          />
          <label
            htmlFor="import-file"
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors cursor-pointer block text-center"
          >
            📥 导入 JSON 数据
          </label>
        </div>
        <button
          onClick={onClearAll}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          🗑️ 清空所有数据
        </button>
      </div>
    </div>
  )
}
