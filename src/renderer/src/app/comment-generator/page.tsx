import { useState, useEffect } from 'react'
import { Student } from '@renderer/type/student'
import { SimpleCommentGenerator } from './utils/simple-comment-generator'
import { exportCommentsToDocx, exportCommentsToTxt, BorderConfig } from './utils/export-utils'
import StudentSelector from './components/StudentSelector'
import CommentResults from './components/CommentResults'
import dayjs from 'dayjs'

interface HistoryRecord {
  id: string
  time: string
  comments: { [key: string]: { comment: string; usedTags: string[] } }
  students: Student[]
}
const HISTORY_KEY = 'commentHistoryRecords'

export default function CommentGeneratorPage(): React.JSX.Element {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [generatedComments, setGeneratedComments] = useState<{
    [key: string]: { comment: string; usedTags: string[] }
  }>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null)

  // 从 localStorage 加载学生数据
  useEffect(() => {
    const savedStudents = localStorage.getItem('students')
    if (savedStudents) {
      try {
        const parsed = JSON.parse(savedStudents)
        setStudents(parsed)
      } catch (error) {
        console.error('Error parsing students data:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // 加载历史记录
  useEffect(() => {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (raw) {
      try {
        setHistory(JSON.parse(raw))
      } catch {
        setHistory([])
      }
    }
  }, [])

  // 切换学生选择状态
  const toggleStudentSelection = (studentId: string) => {
    const newSelected = new Set(selectedStudents)
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId)
    } else {
      newSelected.add(studentId)
    }
    setSelectedStudents(newSelected)
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedStudents.size === students.length) {
      setSelectedStudents(new Set())
    } else {
      setSelectedStudents(new Set(students.map((s) => s.id)))
    }
  }

  // 添加历史记录（生成新批次时）
  const addHistoryRecord = (
    comments: { [key: string]: { comment: string; usedTags: string[] } },
    students: Student[]
  ) => {
    if (Object.keys(comments).length === 0) return
    // 新批次，分配新 id
    const newId = `${Date.now()}`
    const newRecord: HistoryRecord = {
      id: newId,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      comments,
      students
    }
    const newHistory = [newRecord, ...history].slice(0, 20)
    setHistory(newHistory)
    setCurrentHistoryId(newId)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
  }

  // 编辑当前批次时，覆盖当前历史记录
  const handleUpdateComment = (studentId: string, newComment: string) => {
    setGeneratedComments((prev) => {
      const updated = { ...prev, [studentId]: { ...prev[studentId], comment: newComment } }
      // 只更新当前批次的历史
      if (currentHistoryId) {
        const idx = history.findIndex((h) => h.id === currentHistoryId)
        if (idx !== -1) {
          const updatedHistory = [...history]
          updatedHistory[idx] = { ...updatedHistory[idx], comments: updated }
          setHistory(updatedHistory)
          localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
        }
      }
      return updated
    })
  }

  // 生成评语后，自动保存到历史，并设置当前批次 id
  const generateComments = async () => {
    if (selectedStudents.size === 0) return
    setIsGenerating(true)
    try {
      const selectedStudentData = students.filter((s) => selectedStudents.has(s.id))
      const newComments = await SimpleCommentGenerator.generateBatchComments(
        selectedStudentData,
        (completed, total) => {
          // 可以在这里显示进度，暂时省略
          console.log(`Progress: ${completed}/${total}`)
        }
      )
      setGeneratedComments((prev) => ({ ...prev, ...newComments }))
      addHistoryRecord(newComments, students)
    } catch (error) {
      console.error('Error generating comments:', error)
      alert('生成评语时出错，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  // 应用历史记录到当前页面
  const handleApplyHistory = (record: HistoryRecord) => {
    setGeneratedComments(record.comments)
    setCurrentHistoryId(record.id)
    setShowHistory(false)
  }

  // 删除历史
  const handleDeleteHistory = (id: string) => {
    const newHistory = history.filter((h) => h.id !== id)
    setHistory(newHistory)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
    if (currentHistoryId === id) {
      setCurrentHistoryId(null)
    }
  }

  // 复制所有评语
  const copyAllComments = () => {
    const commentsText = Object.entries(generatedComments)
      .map(([studentId, comment]) => {
        const student = students.find((s) => s.id === studentId)
        return `${student?.name}：\n${comment.comment}\n`
      })
      .join('\n')

    navigator.clipboard.writeText(commentsText)
    alert('评语已复制到剪贴板')
  }

  // 导出评语为文档
  const exportComments = async (
    format: 'docx' | 'txt' = 'docx',
    config?: {
      commentsPerLine?: number
      fontSize?: number
      fontFamily?: string
      border?: BorderConfig
    }
  ) => {
    try {
      if (format === 'docx') {
        await exportCommentsToDocx(generatedComments, students, config)
      } else {
        exportCommentsToTxt(generatedComments, students)
      }
    } catch (error) {
      console.error('导出文档时出错：', error)
      alert('导出文档失败，请重试')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-8 relative">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4">
          <span className="text-3xl">✍️</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">期末评语生成器</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          基于学生标签智能生成个性化评语，提高工作效率，让评语更加贴心和专业
        </p>
        {/* 历史记录按钮 */}
        <button
          className="absolute top-0 right-0 mt-2 mr-2 px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors"
          onClick={() => setShowHistory(true)}
        >
          🕑 历史记录
        </button>
      </div>

      {/* 历史记录弹窗 */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setShowHistory(false)}
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">历史生成记录</h3>
            {history.length === 0 ? (
              <div className="text-gray-500 text-center py-8">暂无历史记录</div>
            ) : (
              <div className="space-y-4">
                {history.map((record) => (
                  <div
                    key={record.id}
                    className="border rounded p-3 flex flex-col gap-2 bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">{record.time}</span>
                        <span className="ml-2 text-xs text-gray-500">
                          {Object.keys(record.comments).length} 条评语
                        </span>
                      </div>
                      <div>
                        <button
                          className="text-blue-600 hover:underline text-xs mr-2"
                          onClick={() => handleApplyHistory(record)}
                        >
                          应用到当前页面
                        </button>
                        <button
                          className="text-red-500 hover:underline text-xs"
                          onClick={() => handleDeleteHistory(record.id)}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 max-h-24 overflow-y-auto bg-white rounded p-2 border mt-1">
                      {Object.entries(record.comments).map(([sid, c]) => {
                        const stu = record.students.find((s) => s.id === sid)
                        return (
                          <div key={sid} className="mb-1">
                            <span className="font-bold">{stu?.name || sid}：</span>
                            <span>
                              {c.comment.slice(0, 40)}
                              {c.comment.length > 40 ? '...' : ''}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid md:grid-cols-3 gap-8">
        {/*  Student List & Results */}
        <div className="md:col-span-3 space-y-6">
          {/* Student Selection */}
          <StudentSelector
            students={students}
            selectedStudents={selectedStudents}
            isLoaded={isLoaded}
            isGenerating={isGenerating}
            onToggleStudent={toggleStudentSelection}
            onToggleSelectAll={toggleSelectAll}
            onGenerate={generateComments}
          />

          {/* Generated Comments */}
          <CommentResults
            comments={generatedComments}
            students={students}
            onCopyAll={copyAllComments}
            onExport={exportComments}
            onUpdateComment={handleUpdateComment}
          />
        </div>
      </div>

      {/* Footer Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 使用小贴士</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 评语基于学生管理页面中设置的评价标签自动生成</li>
          <li>• 每次生成会随机选择学生的2-3个标签作为评语内容</li>
          <li>• 如果学生没有标签，系统会生成通用评语</li>
          <li>• 建议先到学生管理页面为学生添加评价标签</li>
          <li>• 生成的评语可以进一步编辑和个性化调整</li>
          <li>• 支持批量复制和导出为 DOCX/TXT 格式，便于后续使用</li>
          <li>• DOCX 格式支持更好的文档格式和边框样式，推荐用于正式文档</li>
          <li>• 可自定义字体类型、字体大小，支持宋体、微软雅黑、楷体等多种字体</li>
          <li>• 提供多种边框模版选择：简单、双线、点线、虚线、粗线、装饰等样式</li>
          <li>• 可自定义边框颜色和粗细，满足不同场景的文档需求</li>
        </ul>
      </div>
    </div>
  )
}
