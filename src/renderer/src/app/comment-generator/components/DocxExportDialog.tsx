import { Student } from '@renderer/type/student'
import { useState, useRef, useEffect } from 'react'
import BorderTemplateSelector from './BorderTemplateSelector'
import { BorderConfig } from '../utils/export-utils'

interface DocxExportDialogProps {
  isOpen: boolean
  onClose: () => void
  onExport: (config: {
    commentsPerLine: number
    fontSize: number
    fontFamily: string
    border: BorderConfig
  }) => void
  comments: { [key: string]: { comment: string; usedTags: string[] } }
  students: Student[]
}

export default function DocxExportDialog({
  isOpen,
  onClose,
  onExport,
  comments,
  students
}: DocxExportDialogProps) {
  const [commentsPerLine, setCommentsPerLine] = useState(1)
  const [fontSize, setFontSize] = useState(12)
  const [fontFamily, setFontFamily] = useState('楷体')
  const [borderConfig, setBorderConfig] = useState<BorderConfig>({
    template: 'simple'
  })
  const docxConfigRef = useRef<HTMLDivElement>(null)

  // 处理点击外部区域关闭弹窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (docxConfigRef.current && !docxConfigRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleExport = () => {
    onExport({ commentsPerLine, fontSize, fontFamily, border: borderConfig })
  }

  // 字体映射 - 将中文字体名称转换为浏览器兼容的字体
  const getFontFamilyForPreview = (fontFamily: string) => {
    const fontMap: { [key: string]: string } = {
      宋体: '"SimSun", "宋体", serif',
      黑体: '"SimHei", "黑体", "Microsoft YaHei", sans-serif',
      楷体: '"KaiTi", "楷体", "STKaiti", serif',
      仿宋: '"FangSong", "仿宋", "STFangsong", serif',
      微软雅黑: '"Microsoft YaHei", "微软雅黑", sans-serif',
      华文中宋: '"STZhongsong", "华文中宋", serif',
      华文楷体: '"STKaiti", "华文楷体", serif',
      隶书: '"LiSu", "隶书", "STLiti", serif',
      幼圆: '"YouYuan", "幼圆", "STYuanti", cursive'
    }

    return fontMap[fontFamily] || fontFamily
  }

  // 生成预览数据
  const generatePreviewData = () => {
    const commentEntries = Object.entries(comments).map(([studentId, commentData]) => {
      const student = students.find((s) => s.id === studentId)
      return {
        studentName: student?.name || '',
        comment: commentData.comment
      }
    })

    const rows: { studentName: string; comment: string }[][] = []
    for (let i = 0; i < commentEntries.length; i += commentsPerLine) {
      const rowComments = commentEntries.slice(i, i + commentsPerLine)
      rows.push(rowComments)
    }
    return rows
  }

  // 获取预览边框样式
  const getPreviewBorderStyle = () => {
    if (!borderConfig || borderConfig.template === 'none') {
      return 'border-none'
    }

    const styleMap = {
      simple: 'border border-gray-800',
      double: 'border-4 border-double border-gray-800',
      dotted: 'border-2 border-dotted border-gray-500',
      dashed: 'border-2 border-dashed border-gray-500',
      thick: 'border-4 border-gray-700',
      decorative: 'border-4 border-double border-blue-600'
    }

    return styleMap[borderConfig.template] || 'border border-gray-800'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={docxConfigRef}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">DOCX 导出配置</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-1 overflow-hidden">
          {/* 左侧配置区域 */}
          <div className="space-y-6 h-full overflow-y-auto">
            <h4 className="font-medium text-gray-900 mb-4">导出设置</h4>

            {/* 每行评语数量 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">每行评语数量</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={commentsPerLine}
                  onChange={(e) => setCommentsPerLine(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 min-w-8">{commentsPerLine}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">建议：1-2个评语便于阅读，3-4个更紧凑</p>
            </div>

            {/* 字体大小 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">字体大小</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="8"
                  max="18"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 min-w-8">{fontSize}pt</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">建议：12pt 标准大小，14pt 便于阅读</p>
            </div>

            {/* 字体类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">字体类型</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="宋体">宋体</option>
                <option value="黑体">黑体</option>
                <option value="楷体">楷体</option>
                <option value="仿宋">仿宋</option>
                <option value="微软雅黑">微软雅黑</option>
                <option value="华文中宋">华文中宋</option>
                <option value="华文楷体">华文楷体</option>
                <option value="隶书">隶书</option>
                <option value="幼圆">幼圆</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                建议：宋体适合正式文档，微软雅黑现代清晰，楷体工整美观
              </p>
            </div>

            {/* 边框设置 */}
            <div>
              <BorderTemplateSelector value={borderConfig} onChange={setBorderConfig} />
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleExport}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                📄 确认导出
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>

          {/* 右侧预览区域 */}
          <div className="h-full overflow-y-auto">
            <h4 className="font-medium text-gray-900 mb-4">预览效果</h4>
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 max-h-full overflow-y-auto">
              <div
                className="bg-white p-4 rounded shadow-sm"
                style={{
                  fontSize: `${fontSize}px`,
                  fontFamily: getFontFamilyForPreview(fontFamily)
                }}
              >
                {generatePreviewData().map((row, rowIndex) => (
                  <div key={rowIndex} className="mb-4">
                    <div
                      className="grid gap-4"
                      style={{ gridTemplateColumns: `repeat(${commentsPerLine}, 1fr)` }}
                    >
                      {row.map((item, colIndex) => (
                        <div
                          key={colIndex}
                          className={`p-3 rounded bg-white ${getPreviewBorderStyle()}`}
                        >
                          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {item.comment}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              预览显示文档的大致布局效果，实际边框样式以导出的DOCX文档为准
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
