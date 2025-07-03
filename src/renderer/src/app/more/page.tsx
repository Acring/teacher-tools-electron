import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'

export default function MorePage() {
  const tools = [
    {
      title: '多元智能分析',
      description: '基于多元智能理论的学生能力评估工具',
      path: '/multiple-intelligence',
      icon: '📊'
    }
    // 将来可以在这里添加更多工具
  ]

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">更多工具</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div key={tool.path} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">{tool.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{tool.title}</h2>
            <p className="text-gray-600 mb-4">{tool.description}</p>
            <Button asChild>
              <Link to={tool.path}>打开</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
