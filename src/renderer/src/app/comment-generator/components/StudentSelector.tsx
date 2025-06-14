import { Link } from 'react-router-dom'
import { Student } from '@renderer/type/student'

interface StudentSelectorProps {
  students: Student[]
  selectedStudents: Set<string>
  isLoaded: boolean
  isGenerating: boolean
  onToggleStudent: (studentId: string) => void
  onToggleSelectAll: () => void
  onGenerate: () => void
}

export default function StudentSelector({
  students,
  selectedStudents,
  isLoaded,
  isGenerating,
  onToggleStudent,
  onToggleSelectAll,
  onGenerate
}: StudentSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="text-xl mr-2">📋</span>
          选择学生 ({selectedStudents.size})
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={onToggleSelectAll}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            {selectedStudents.size === students.length ? '❌ 取消全选' : '✅ 全选'}
          </button>
          <button
            onClick={onGenerate}
            disabled={selectedStudents.size === 0 || isGenerating}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isGenerating ? '⏳ 生成中...' : '🚀 批量生成'}
          </button>
        </div>
      </div>

      {!isLoaded ? (
        <div className="text-center py-8">
          <div className="text-2xl mb-2">⏳</div>
          <p className="text-gray-500">加载中...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">👥</div>
          <p>请先到学生管理页面添加学生信息</p>
          <p className="text-sm mb-4">完成后回到此页面即可看到学生列表</p>
          <Link
            to="/students"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
          >
            前往学生管理
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {students.map((student) => (
            <div
              key={student.id}
              onClick={() => onToggleStudent(student.id)}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md flex justify-between items-center ${
                selectedStudents.has(student.id)
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-[4px]">
                <span className="font-medium">{student.name}</span>
                {/* 显示学生已有的标签数量 */}
                {student.evaluationTags && (
                  <div className="text-xs text-gray-500">
                    {Object.values(student.evaluationTags).flat().length} 个标签
                  </div>
                )}
              </div>
              {selectedStudents.has(student.id) && <span className="text-green-600">✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
