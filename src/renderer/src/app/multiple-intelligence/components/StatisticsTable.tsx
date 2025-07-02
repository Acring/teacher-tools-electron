import { StatisticsData } from '../types'

interface StatisticsTableProps {
  statistics: StatisticsData[]
}

export default function StatisticsTable({ statistics }: StatisticsTableProps) {
  if (statistics.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">详细统计数据</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">测评项目</th>
              <th className="border border-gray-300 px-4 py-2 text-center">平均分</th>
              <th className="border border-gray-300 px-4 py-2 text-center">最高分</th>
              <th className="border border-gray-300 px-4 py-2 text-center">最低分</th>
              <th className="border border-gray-300 px-4 py-2 text-center">参与人数</th>
              <th className="border border-gray-300 px-4 py-2 text-center">及格率</th>
            </tr>
          </thead>
          <tbody>
            {statistics.map((stat, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-4 py-2 font-medium">{stat.subjectName}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{stat.average}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{stat.max}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{stat.min}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{stat.count}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      stat.passRate >= 80
                        ? 'bg-green-100 text-green-800'
                        : stat.passRate >= 60
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {stat.passRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
