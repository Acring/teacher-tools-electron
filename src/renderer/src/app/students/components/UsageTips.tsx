export default function UsageTips() {
  return (
    <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-4">
      <h3 className="font-medium text-purple-900 mb-2">💡 使用建议</h3>
      <ul className="text-sm text-purple-700 space-y-1">
        <li>• 使用英文逗号（,）或中文逗号（，）分隔批量添加多个学生姓名</li>
        <li>• 学生数据会自动保存到浏览器本地存储，下次打开时会自动恢复</li>
        <li>• 支持按姓名搜索，快速查找特定学生</li>
        <li>• 清空数据前会有确认提示，避免误操作</li>
        <li>• 可以导出学生数据为 JSON 文件，方便在不同电脑间转移数据</li>
        <li>• 导入 JSON 文件时会自动去重，避免重复添加相同姓名的学生</li>
        <li>• 点击&ldquo;编辑标签&rdquo;可以为学生添加评价标签，系统会自动检测冲突标签</li>
      </ul>
    </div>
  )
}
