export default function PageHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-4">
        <span className="text-3xl">👥</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">学生管理</h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        快速添加和管理学生姓名，数据自动保存到本地
      </p>
    </div>
  )
}
