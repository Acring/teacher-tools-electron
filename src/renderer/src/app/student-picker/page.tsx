import { Link } from 'react-router-dom'

export default function StudentPickerPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-4">
          <span className="text-3xl">🎯</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">学生抽奖器</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          公平随机选择学生进行课堂提问或抽奖活动，让课堂互动更有趣
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Panel - Settings & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Student Data Source */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-xl mr-2">👥</span>
              学生数据
            </h2>
            <div className="text-center py-4">
              <div className="text-3xl mb-3">📋</div>
              <p className="text-gray-600 text-sm mb-3">从学生管理获取数据</p>
              <Link
                to="/students"
                className="inline-flex items-center px-3 py-2 bg-purple-500 text-white text-sm font-medium rounded-md hover:bg-purple-600 transition-colors"
              >
                <span className="mr-1">👥</span>
                学生管理
              </Link>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">可用学生：</span>
                <span className="font-semibold text-green-600">0人</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">当前班级：</span>
                <span className="font-semibold text-green-600">全部</span>
              </div>
            </div>
          </div>

          {/* Class Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-xl mr-2">🏫</span>
              班级筛选
            </h2>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>全部班级</option>
              <option>三年级一班</option>
              <option>三年级二班</option>
            </select>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-xl mr-2">⚙️</span>
              抽奖设置
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">动画效果</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>快速滚动 (1秒)</option>
                  <option>标准滚动 (2秒)</option>
                  <option>慢速滚动 (3秒)</option>
                  <option>超慢滚动 (5秒)</option>
                </select>
              </div>
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-700">避免重复抽取</span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-700">显示抽取历史</span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-700">播放音效</span>
                </label>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-xl mr-2">🚀</span>
              快速操作
            </h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                🔄 刷新学生数据
              </button>
              <button className="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
                🔄 重置抽取记录
              </button>
              <button className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
                📊 查看抽取统计
              </button>
            </div>
          </div>
        </div>

        {/* Center Panel - Main Picker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Picker Display */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              {/* Picker Display Area */}
              <div className="mb-8">
                <div className="w-80 h-80 mx-auto bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center border-4 border-green-200 shadow-lg">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎯</div>
                    <div className="text-2xl font-bold text-gray-700 mb-2">准备开始</div>
                    <div className="text-gray-500">请先添加学生数据</div>
                  </div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center space-x-4">
                <button className="px-8 py-3 bg-gray-300 text-gray-500 text-lg font-semibold rounded-lg cursor-not-allowed">
                  🎯 开始抽奖
                </button>
                <button className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
                  ⏹️ 停止
                </button>
                <button className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
                  🔄 重新抽取
                </button>
              </div>

              {/* Winner Display */}
              <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">🏆 当前选中</h3>
                <div className="text-center py-4 text-gray-500">
                  <div className="text-3xl mb-2">👤</div>
                  <p>还没有进行抽奖</p>
                  <p className="text-sm">请先到学生管理页面添加学生</p>
                </div>
              </div>
            </div>
          </div>

          {/* Student List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="text-xl mr-2">📋</span>
                参与学生 (0)
              </h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-500 rounded-md cursor-not-allowed">
                  ✅ 全选
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-500 rounded-md cursor-not-allowed">
                  ❌ 清空
                </button>
              </div>
            </div>

            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">👥</div>
              <p>请先到学生管理页面添加学生信息</p>
              <p className="text-sm mb-4">完成后回到此页面即可看到学生列表</p>
              <Link
                to="/students"
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors"
              >
                前往学生管理
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-xl mr-2">🗓️</span>
              抽取历史
            </h2>
            <div className="text-center py-8 text-gray-500">
              <div className="text-3xl mb-2">📊</div>
              <p>还没有抽取记录</p>
              <p className="text-sm">开始抽奖后，这里会显示历史记录</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
