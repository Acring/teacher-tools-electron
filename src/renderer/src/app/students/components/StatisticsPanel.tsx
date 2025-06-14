interface StatisticsPanelProps {
  totalStudents: number
  filteredStudents: number
}

export default function StatisticsPanel({ totalStudents, filteredStudents }: StatisticsPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="text-xl mr-2">📊</span>
        统计信息
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">总学生数：</span>
          <span className="font-semibold text-purple-600">{totalStudents} 人</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">当前显示：</span>
          <span className="font-semibold text-purple-600">{filteredStudents} 人</span>
        </div>
      </div>
    </div>
  )
}
