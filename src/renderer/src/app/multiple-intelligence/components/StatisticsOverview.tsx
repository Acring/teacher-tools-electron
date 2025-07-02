import { IntelligenceData, StatisticsData } from '../types'

interface StatisticsOverviewProps {
  testData: IntelligenceData
  statistics: StatisticsData[]
}

export default function StatisticsOverview({ testData, statistics }: StatisticsOverviewProps) {
  const maxAverage =
    statistics.length > 0 ? Math.max(...statistics.map((s) => s.average)).toFixed(1) : '-'

  const overallPassRate =
    statistics.length > 0
      ? (statistics.reduce((sum, s) => sum + s.passRate, 0) / statistics.length).toFixed(1) + '%'
      : '-'

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800">学生总数</h3>
        <p className="text-2xl font-bold text-blue-600">{testData.parsedStudents.length}</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800">测评项目</h3>
        <p className="text-2xl font-bold text-green-600">{statistics.length}</p>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-800">最高平均分</h3>
        <p className="text-2xl font-bold text-purple-600">{maxAverage}</p>
      </div>
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-orange-800">整体及格率</h3>
        <p className="text-2xl font-bold text-orange-600">{overallPassRate}</p>
      </div>
    </div>
  )
}
