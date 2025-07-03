import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../../../components/ui/dialog'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">设置报告标题</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <label htmlFor="mainTitle" className="block text-sm font-medium text-gray-700">
              主标题
            </label>
            <Input
              id="mainTitle"
              value={mainTitle}
              onChange={(e) => setMainTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="subTitle" className="block text-sm font-medium text-gray-700">
              副标题
            </label>
            <Input id="subTitle" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleConfirm}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
