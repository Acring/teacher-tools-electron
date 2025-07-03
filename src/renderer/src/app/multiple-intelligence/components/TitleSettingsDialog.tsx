import { useState, useEffect } from 'react'

interface TitleSettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (mainTitle: string, subTitle: string) => void
  defaultMainTitle?: string
  defaultSubTitle?: string
}

export default function TitleSettingsDialog({
  isOpen,
  onClose,
  onConfirm,
  defaultMainTitle = '宝安中学（集团）实验学校 2024 至 2025 学年度第二学期小学部',
  defaultSubTitle = '一年级指向多元智能发展的个性化综合测评报告'
}: TitleSettingsDialogProps) {
  const [mainTitle, setMainTitle] = useState(defaultMainTitle)
  const [subTitle, setSubTitle] = useState(defaultSubTitle)

  // 当对话框打开时重置为默认值
  useEffect(() => {
    if (isOpen) {
      setMainTitle(defaultMainTitle)
      setSubTitle(defaultSubTitle)
    }
  }, [isOpen, defaultMainTitle, defaultSubTitle])

  const handleConfirm = () => {
    onConfirm(mainTitle, subTitle)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">设置报告标题</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="mainTitle" className="block text-sm font-medium text-gray-700 mb-1">
              主标题
            </label>
            <input
              type="text"
              id="mainTitle"
              value={mainTitle}
              onChange={(e) => setMainTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="subTitle" className="block text-sm font-medium text-gray-700 mb-1">
              副标题
            </label>
            <input
              type="text"
              id="subTitle"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  )
}
