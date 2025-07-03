import { useState } from 'react'
import { StudentData } from '../types'
import { batchExportReports, exportStudentReport } from '../utils/report-export'
import TitleSettingsDialog from './TitleSettingsDialog'

interface ReportExporterProps {
  students: StudentData[]
  addLog: (message: string) => void
}

export default function ReportExporter({ students, addLog }: ReportExporterProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 })
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set())
  const [isTitleDialogOpen, setIsTitleDialogOpen] = useState(false)
  const [exportType, setExportType] = useState<'single' | 'selected' | 'all'>('all')
  const [studentToExport, setStudentToExport] = useState<StudentData | null>(null)

  // 处理单个学生选择
  const handleStudentSelect = (index: number, selected: boolean) => {
    const newSelected = new Set(selectedStudents)
    if (selected) {
      newSelected.add(index)
    } else {
      newSelected.delete(index)
    }
    setSelectedStudents(newSelected)
  }

  // 全选/取消全选
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedStudents(new Set(students.map((_, index) => index)))
    } else {
      setSelectedStudents(new Set())
    }
  }

  // 打开标题设置对话框 - 导出所有
  const openExportAllDialog = () => {
    setExportType('all')
    setIsTitleDialogOpen(true)
  }

  // 打开标题设置对话框 - 导出选中
  const openExportSelectedDialog = () => {
    if (selectedStudents.size === 0) {
      addLog('请先选择要导出的学生')
      return
    }
    setExportType('selected')
    setIsTitleDialogOpen(true)
  }

  // 打开标题设置对话框 - 导出单个
  const openExportSingleDialog = (student: StudentData) => {
    setStudentToExport(student)
    setExportType('single')
    setIsTitleDialogOpen(true)
  }

  // 关闭标题设置对话框
  const closeTitleDialog = () => {
    setIsTitleDialogOpen(false)
  }

  // 确认标题设置并导出
  const handleTitleConfirm = async (mainTitle: string, subTitle: string) => {
    setIsTitleDialogOpen(false)

    try {
      setIsExporting(true)

      if (exportType === 'all') {
        setExportProgress({ current: 0, total: students.length })
        await batchExportReports(
          students,
          addLog,
          (current, total) => setExportProgress({ current, total }),
          mainTitle,
          subTitle
        )
      } else if (exportType === 'selected') {
        const selectedStudentsList = Array.from(selectedStudents).map((index) => students[index])
        setExportProgress({ current: 0, total: selectedStudentsList.length })
        await batchExportReports(
          selectedStudentsList,
          addLog,
          (current, total) => setExportProgress({ current, total }),
          mainTitle,
          subTitle
        )
      } else if (exportType === 'single' && studentToExport) {
        await exportStudentReport(studentToExport, addLog, false, mainTitle, subTitle)
      }
    } catch (error) {
      addLog(`导出过程中出错: ${error}`)
    } finally {
      setIsExporting(false)
      setExportProgress({ current: 0, total: 0 })
      setStudentToExport(null)
    }
  }

  if (students.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">学生测评报告导出</h2>
          <p className="text-sm text-gray-600 mt-1">
            为每个学生生成包含雷达图和评价表的 Word 测评报告
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">共 {students.length} 名学生</p>
          <p className="text-sm text-gray-500">已选择 {selectedStudents.size} 名</p>
        </div>
      </div>

      {/* 批量操作按钮 */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={openExportAllDialog}
          disabled={isExporting}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <span className="text-xl">📄</span>
          {isExporting ? '导出中...' : '导出所有学生'}
        </button>

        <button
          onClick={openExportSelectedDialog}
          disabled={isExporting || selectedStudents.size === 0}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <span className="text-xl">✅</span>
          {isExporting ? '导出中...' : `导出选中 (${selectedStudents.size})`}
        </button>

        <button
          onClick={() => handleSelectAll(selectedStudents.size !== students.length)}
          disabled={isExporting}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {selectedStudents.size === students.length ? '取消全选' : '全选'}
        </button>
      </div>

      {/* 导出进度 */}
      {isExporting && exportProgress.total > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">导出进度</span>
            <span className="text-sm text-blue-700">
              {exportProgress.current} / {exportProgress.total}
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(exportProgress.current / exportProgress.total) * 100}%`
              }}
            />
          </div>
        </div>
      )}

      {/* 学生列表 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedStudents.size === students.length && students.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
              disabled={isExporting}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900">学生列表</span>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {students.map((student, index) => (
            <div
              key={`${student.班级}-${student.姓名}-${index}`}
              className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedStudents.has(index)}
                  onChange={(e) => handleStudentSelect(index, e.target.checked)}
                  disabled={isExporting}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900">{student.姓名}</span>
                  <span className="ml-2 text-sm text-gray-500">({student.班级})</span>
                </div>
              </div>

              <button
                onClick={() => openExportSingleDialog(student)}
                disabled={isExporting}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                单独导出
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 使用说明 */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-900 mb-2">💡 导出说明</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 每份报告包含学生基本信息、多元智能雷达图和个性化评价表</li>
          <li>
            • 雷达图展示六个智能维度：言语语言、逻辑数理、自然观察、视觉空间、身体运动、内省智能
          </li>
          <li>• 评价表自动分析优势智能、弱势智能并提供针对性的提升策略</li>
          <li>• 批量导出时会依次下载每个学生的报告文件</li>
          <li>• 建议先选择部分学生测试导出效果，确认无误后再批量导出</li>
        </ul>
      </div>

      {/* 标题设置对话框 */}
      <TitleSettingsDialog
        isOpen={isTitleDialogOpen}
        onClose={closeTitleDialog}
        onConfirm={handleTitleConfirm}
      />
    </div>
  )
}
