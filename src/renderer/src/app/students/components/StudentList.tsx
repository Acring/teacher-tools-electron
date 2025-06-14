import { Student } from '@renderer/type/student'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface StudentListProps {
  students: Student[]
  searchTerm: string
  setSearchTerm: (value: string) => void
  onEditTags: (student: Student) => void
  onDeleteStudent: (id: string) => void
}

export default function StudentList({
  students,
  searchTerm,
  setSearchTerm,
  onEditTags,
  onDeleteStudent
}: StudentListProps) {
  const [visibleTags, setVisibleTags] = useState<Set<string>>(new Set())

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleTagVisibility = (studentId: string) => {
    const newVisibleTags = new Set(visibleTags)
    if (newVisibleTags.has(studentId)) {
      newVisibleTags.delete(studentId)
    } else {
      newVisibleTags.add(studentId)
    }
    setVisibleTags(newVisibleTags)
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">搜索学生</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="输入姓名搜索..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="text-xl mr-2">📋</span>
            学生列表 ({filteredStudents.length})
          </h2>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">👥</div>
            <p>{students.length === 0 ? '还没有添加学生' : '没有符合条件的学生'}</p>
            <p className="text-sm">
              {students.length === 0 ? '使用左侧批量添加功能或导入示例数据' : '尝试调整搜索条件'}
            </p>
          </div>
        ) : (
          <div className="grid gap-2">
            {filteredStudents.map((student, index) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-600">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      {student.evaluationTags && (
                        <button
                          onClick={() => toggleTagVisibility(student.id)}
                          className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                          title={visibleTags.has(student.id) ? '隐藏标签' : '显示标签'}
                        >
                          {visibleTags.has(student.id) ? <EyeOff size={12} /> : <Eye size={12} />}
                          <span>{visibleTags.has(student.id) ? '隐藏' : '查看'}标签</span>
                        </button>
                      )}
                      {visibleTags.has(student.id) && student.evaluationTags && (
                        <div className="flex flex-wrap gap-1">
                          {[
                            ...student.evaluationTags.characteristics,
                            ...student.evaluationTags.discipline,
                            ...student.evaluationTags.academic,
                            ...student.evaluationTags.homework,
                            ...student.evaluationTags.physicalLabor
                          ]
                            .slice(0, 3)
                            .map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          {[
                            ...student.evaluationTags.characteristics,
                            ...student.evaluationTags.discipline,
                            ...student.evaluationTags.academic,
                            ...student.evaluationTags.homework,
                            ...student.evaluationTags.physicalLabor
                          ].length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                              +
                              {[
                                ...student.evaluationTags.characteristics,
                                ...student.evaluationTags.discipline,
                                ...student.evaluationTags.academic,
                                ...student.evaluationTags.homework,
                                ...student.evaluationTags.physicalLabor
                              ].length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditTags(student)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    编辑标签
                  </button>
                  <button
                    onClick={() => onDeleteStudent(student.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
