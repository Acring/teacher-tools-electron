interface BulkAddStudentsProps {
  bulkStudentNames: string
  setBulkStudentNames: (value: string) => void
  onAddBulkStudents: () => void
}

export default function BulkAddStudents({
  bulkStudentNames,
  setBulkStudentNames,
  onAddBulkStudents
}: BulkAddStudentsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="text-xl mr-2">📝</span>
        批量添加学生
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            学生姓名（逗号分隔）
          </label>
          <textarea
            value={bulkStudentNames}
            onChange={(e) => setBulkStudentNames(e.target.value)}
            placeholder="张三,李四,王五 或 张三，李四，王五"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-xs text-gray-500 mt-1">用逗号（, 或 ，）分隔多个学生姓名</p>
        </div>
        <button
          onClick={onAddBulkStudents}
          disabled={!bulkStudentNames.trim()}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          批量添加
        </button>
      </div>
    </div>
  )
}
