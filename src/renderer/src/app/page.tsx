import { Link } from 'react-router-dom'

export default function HomePage(): React.JSX.Element {
  const tools = [
    {
      id: 'students',
      title: '学生管理',
      description: '统一管理学生信息，为其他功能提供数据支持',
      icon: '👥',
      href: '/students',
      color: 'bg-purple-500',
      features: ['学生信息录入', '班级分组管理', '批量导入导出', '数据统计分析']
    },
    {
      id: 'comment-generator',
      title: '期末评语生成器',
      description: '快速为每个学生生成个性化的期末评语，提高工作效率',
      icon: '✍️',
      href: '/comment-generator',
      color: 'bg-blue-500',
      features: ['批量生成', '个性化定制', '多种模板', '导出功能']
    },
    {
      id: 'student-picker',
      title: '学生抽奖器',
      description: '随机选择学生进行课堂提问或抽奖活动，让课堂更有趣',
      icon: '🎯',
      href: '/student-picker',
      color: 'bg-green-500',
      features: ['公平随机', '动画效果', '历史记录', '班级筛选']
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">教师工具箱</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          简洁高效的教师辅助工具集合，让教学工作更轻松，让课堂更有趣
        </p>
        <div className="flex justify-center space-x-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            🚀 简单易用
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            ⚡ 高效便捷
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            🎨 界面美观
          </span>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-center mb-4">
              <div className={`${tool.color} p-3 rounded-lg text-white text-3xl inline-block mb-4`}>
                {tool.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{tool.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{tool.description}</p>
            </div>
            <div className="space-y-2 mb-6">
              {tool.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-500">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                  {feature}
                </div>
              ))}
            </div>
            <Link
              to={tool.href}
              className={`block w-full text-center px-4 py-2 ${tool.color} text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity`}
            >
              开始使用
            </Link>
          </div>
        ))}
      </div>

      {/* Workflow Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">💡 推荐使用流程</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">1️⃣</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">设置学生数据</h3>
            <p className="text-gray-600 text-sm">
              首先在学生管理页面添加或导入学生信息，支持按班级分组管理
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">2️⃣</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">生成期末评语</h3>
            <p className="text-gray-600 text-sm">
              使用评语生成器为学生批量生成个性化评语，提高工作效率
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">3️⃣</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">课堂互动抽奖</h3>
            <p className="text-gray-600 text-sm">在课堂上使用学生抽奖器进行随机提问或奖励活动</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          为什么选择教师工具箱？
        </h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">简洁</div>
            <p className="text-gray-600">界面简洁直观，无需复杂学习即可上手使用</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">高效</div>
            <p className="text-gray-600">大幅提升工作效率，节省宝贵的教学准备时间</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">实用</div>
            <p className="text-gray-600">专为教师设计，解决日常教学中的实际需求</p>
          </div>
        </div>
      </div>
    </div>
  )
}
