import React, { useEffect, useState } from 'react'
import { COMMENT_TEMPLATES, IMPROVEMENT_TEMPLATES } from '@renderer/constants/comment-templates'
import { Trash2Icon } from 'lucide-react'

interface TemplateManagerProps {
  onClose: () => void
}

// 模版库类型
interface Templates {
  [tag: string]: string[]
}

const STORAGE_KEY = 'commentTemplates'
const IMPROVEMENT_STORAGE_KEY = 'improvementTemplates'

const flattenTemplates = (raw: Record<string, Record<string, string[]>>): Templates => {
  // 将多级对象拍平成 {tag: [文案]} 结构
  const result: Templates = {}
  Object.values(raw).forEach((category) => {
    Object.entries(category).forEach(([tag, arr]) => {
      result[tag] = arr as string[]
    })
  })
  return result
}

// 新增 TagTemplatePanel 组件
const TagTemplatePanel: React.FC<{
  tag: string
  tplList: string[]
  editIndex: { [tag: string]: number | null }
  editValue: { [tag: string]: string }
  newTemplateInputs: { [tag: string]: string }
  onEdit: (tag: string, idx: number, value: string) => void
  onSaveEdit: (tag: string, idx: number) => void
  onCancelEdit: (tag: string) => void
  onDelete: (tag: string, idx: number) => void
  onAddTemplate: (tag: string) => void
  onInputChange: (tag: string, value: string) => void
}> = ({
  tag,
  tplList,
  editIndex,
  editValue,
  newTemplateInputs,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onAddTemplate,
  onInputChange
}) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="border rounded p-3 bg-gray-50 flex flex-col gap-2">
      <div
        className="font-bold text-blue-700 flex items-center cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <span>{tag}</span>
        <svg
          className={`ml-2 w-4 h-4 transition-transform duration-200 ${expanded ? '' : 'rotate-[-90deg]'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {expanded && (
        <>
          <div className="space-y-2 mb-2">
            {tplList.length === 0 && <div className="text-gray-400 text-sm">暂无文案</div>}
            {tplList.map((tpl, idx) => (
              <div key={idx} className="flex items-center gap-2 border rounded p-1">
                {editIndex[tag] === idx ? (
                  <>
                    <textarea
                      className="border px-2 py-1 rounded w-full text-sm flex-1"
                      value={editValue[tag]}
                      autoFocus
                      onChange={(e) => onInputChange(tag, e.target.value)}
                      onBlur={() => onSaveEdit(tag, idx)}
                    />
                    <button
                      className="text-gray-500 hover:underline text-xs"
                      onClick={() => onCancelEdit(tag)}
                    >
                      取消
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      className="flex-1 text-gray-800 text-sm"
                      onClick={() => onEdit(tag, idx, tpl)}
                    >
                      {tpl}
                    </span>
                    <button
                      className="text-red-500 hover:underline text-xs"
                      onClick={() => onDelete(tag, idx)}
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="border px-2 py-1 rounded flex-1 text-sm"
              placeholder="新增文案"
              value={newTemplateInputs[tag] || ''}
              onChange={(e) => onInputChange(tag, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onAddTemplate(tag)
              }}
            />
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              onClick={() => onAddTemplate(tag)}
            >
              添加
            </button>
          </div>
        </>
      )}
    </div>
  )
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ onClose }) => {
  // 正向/改进建议切换
  const [tab, setTab] = useState<'positive' | 'improvement'>('positive')
  // 正向模版
  const [templates, setTemplates] = useState<Templates>({})
  // 改进建议模版
  const [improvementTemplates, setImprovementTemplates] = useState<Templates>({})
  // 新增文案输入框内容
  const [newTemplateInputs, setNewTemplateInputs] = useState<{ [tag: string]: string }>({})
  // 编辑状态
  const [editIndex, setEditIndex] = useState<{ [tag: string]: number | null }>({})
  const [editValue, setEditValue] = useState<{ [tag: string]: string }>({})

  // 初始化加载
  useEffect(() => {
    // 正向
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        setTemplates(JSON.parse(raw))
      } catch {
        setTemplates(flattenTemplates(COMMENT_TEMPLATES))
      }
    } else {
      setTemplates(flattenTemplates(COMMENT_TEMPLATES))
    }
    // 改进
    const rawImp = localStorage.getItem(IMPROVEMENT_STORAGE_KEY)
    if (rawImp) {
      try {
        setImprovementTemplates(JSON.parse(rawImp))
      } catch {
        setImprovementTemplates(flattenTemplates(IMPROVEMENT_TEMPLATES))
      }
    } else {
      setImprovementTemplates(flattenTemplates(IMPROVEMENT_TEMPLATES))
    }
  }, [])

  // 保存正向模版
  const saveTemplates = (newTemplates: Templates) => {
    setTemplates(newTemplates)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTemplates))
  }
  // 保存改进建议模版
  const saveImprovementTemplates = (newTemplates: Templates) => {
    setImprovementTemplates(newTemplates)
    localStorage.setItem(IMPROVEMENT_STORAGE_KEY, JSON.stringify(newTemplates))
  }

  // 删除文案
  const handleDelete = (tag: string, idx: number) => {
    if (tab === 'positive') {
      const newTemplates = { ...templates }
      newTemplates[tag] = newTemplates[tag].filter((_, i) => i !== idx)
      saveTemplates(newTemplates)
    } else {
      const newTemplates = { ...improvementTemplates }
      newTemplates[tag] = newTemplates[tag].filter((_, i) => i !== idx)
      saveImprovementTemplates(newTemplates)
    }
  }

  // 开始编辑
  const handleEdit = (tag: string, idx: number, value: string) => {
    setEditIndex((prev) => ({ ...prev, [tag]: idx }))
    setEditValue((prev) => ({ ...prev, [tag]: value }))
  }

  // 保存编辑
  const handleSaveEdit = (tag: string, idx: number) => {
    if (tab === 'positive') {
      const newTemplates = { ...templates }
      newTemplates[tag][idx] = editValue[tag]
      saveTemplates(newTemplates)
    } else {
      const newTemplates = { ...improvementTemplates }
      newTemplates[tag][idx] = editValue[tag]
      saveImprovementTemplates(newTemplates)
    }
    setEditIndex((prev) => ({ ...prev, [tag]: null }))
  }

  // 取消编辑
  const handleCancelEdit = (tag: string) => {
    setEditIndex((prev) => ({ ...prev, [tag]: null }))
  }

  // 新增文案
  const handleAddTemplate = (tag: string) => {
    const value = newTemplateInputs[tag]?.trim()
    if (!value) return
    if (tab === 'positive') {
      const newTemplates = { ...templates }
      newTemplates[tag] = [...(newTemplates[tag] || []), value]
      saveTemplates(newTemplates)
    } else {
      const newTemplates = { ...improvementTemplates }
      newTemplates[tag] = [...(newTemplates[tag] || []), value]
      saveImprovementTemplates(newTemplates)
    }
    setNewTemplateInputs((prev) => ({ ...prev, [tag]: '' }))
  }

  // 当前展示的模版
  const currentTemplates = tab === 'positive' ? templates : improvementTemplates

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-lg font-semibold mb-4">模版库管理</h3>
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-1 rounded ${tab === 'positive' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setTab('positive')}
          >
            正向评价
          </button>
          <button
            className={`px-4 py-1 rounded ${tab === 'improvement' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setTab('improvement')}
          >
            改进建议
          </button>
        </div>
        {Object.keys(currentTemplates).length === 0 ? (
          <div className="text-gray-500 text-center py-8">暂无标签模版</div>
        ) : (
          <div className="space-y-6">
            {Object.entries(currentTemplates).map(([tag, tplList]) => (
              <TagTemplatePanel
                key={tag}
                tag={tag}
                tplList={tplList}
                editIndex={editIndex}
                editValue={editValue}
                newTemplateInputs={newTemplateInputs}
                onEdit={handleEdit}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onDelete={handleDelete}
                onAddTemplate={handleAddTemplate}
                onInputChange={(tag, value) => {
                  setEditValue((prev) => ({ ...prev, [tag]: value }))
                  setNewTemplateInputs((prev) => ({ ...prev, [tag]: value }))
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateManager
