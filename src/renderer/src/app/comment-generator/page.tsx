import { useState, useEffect } from 'react'
import { Student } from '@renderer/type/student'
import { SimpleCommentGenerator } from './utils/simple-comment-generator'
import { exportCommentsToDocx, exportCommentsToTxt, BorderConfig } from './utils/export-utils'
import StudentSelector from './components/StudentSelector'
import CommentResults from './components/CommentResults'

export default function CommentGeneratorPage(): React.JSX.Element {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [generatedComments, setGeneratedComments] = useState<{
    [key: string]: { comment: string; usedTags: string[] }
  }>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

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

  // 批量生成评语
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
    } catch (error) {
      console.error('Error generating comments:', error)
      alert('生成评语时出错，请重试')
    } finally {
      setIsGenerating(false)
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
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4">
          <span className="text-3xl">✍️</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">期末评语生成器</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          基于学生标签智能生成个性化评语，提高工作效率，让评语更加贴心和专业
        </p>
      </div>

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
