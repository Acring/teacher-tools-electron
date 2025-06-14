import { Student } from '@renderer/type/student'
import { useState, useEffect, useRef } from 'react'
import { BorderConfig } from '../utils/export-utils'
import DocxExportDialog from './DocxExportDialog'

interface CommentResultsProps {
  comments: { [key: string]: { comment: string; usedTags: string[] } }
  students: Student[]
  onCopyAll: () => void
  onExport: (
    format: 'docx' | 'txt',
    config?: {
      commentsPerLine?: number
      fontSize?: number
      fontFamily?: string
      border?: BorderConfig
    }
  ) => void
}

export default function CommentResults({
  comments,
  students,
  onCopyAll,
  onExport
}: CommentResultsProps) {
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showDocxConfig, setShowDocxConfig] = useState(false)
  const exportMenuRef = useRef<HTMLDivElement>(null)

  // 处理点击外部区域关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false)
      }
    }

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showExportMenu])

  const copyComment = (comment: string) => {
    navigator.clipboard.writeText(comment)
    // 可以添加一个简单的提示
    const originalText = '复制'
    const button = event?.target as HTMLButtonElement
    if (button) {
      button.textContent = '已复制!'
      setTimeout(() => {
        button.textContent = originalText
      }, 1000)
    }
  }

  const handleExport = (format: 'docx' | 'txt') => {
    if (format === 'docx') {
      setShowDocxConfig(true)
      setShowExportMenu(false)
    } else {
      onExport(format)
      setShowExportMenu(false)
    }
  }

  const handleDocxExport = (config: {
    commentsPerLine: number
    fontSize: number
    fontFamily: string
    border: BorderConfig
  }) => {
    onExport('docx', config)
    setShowDocxConfig(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="text-xl mr-2">📄</span>
          生成的评语 ({Object.keys(comments).length})
        </h2>
        {Object.keys(comments).length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={onCopyAll}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              📋 复制全部
            </button>
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center"
              >
                📥 导出文档
                <span className="ml-1 text-xs">▼</span>
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-32">
                  <button
                    onClick={() => handleExport('docx')}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    📄 DOCX 格式
                  </button>
                  <button
                    onClick={() => handleExport('txt')}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    📝 TXT 格式
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* DOCX 配置弹窗 */}
      <DocxExportDialog
        isOpen={showDocxConfig}
        onClose={() => setShowDocxConfig(false)}
        onExport={handleDocxExport}
        comments={comments}
        students={students}
      />

      {Object.keys(comments).length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">✍️</div>
          <p>评语将在这里显示</p>
          <p className="text-sm">选择学生并点击生成按钮开始</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(comments).map(([studentId, commentData]) => {
            const student = students.find((s) => s.id === studentId)
            return (
              <div key={studentId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{student?.name}</h3>
                  <button
                    onClick={() => copyComment(commentData.comment)}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    复制
                  </button>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {commentData.comment}
                </p>

                {/* 显示基于哪些标签生成的 */}
                {commentData.usedTags && commentData.usedTags.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      基于标签：
                      <span className="ml-1">{commentData.usedTags.join('、')}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
