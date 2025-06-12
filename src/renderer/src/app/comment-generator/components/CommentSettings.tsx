interface CommentSettingsProps {
  style: string;
  length: string;
  onStyleChange: (style: string) => void;
  onLengthChange: (length: string) => void;
}

export default function CommentSettings({
  style,
  length,
  onStyleChange,
  onLengthChange,
}: CommentSettingsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="text-xl mr-2">⚙️</span>
        生成设置
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">评语风格</label>
          <select
            value={style}
            onChange={e => onStyleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="encouraging">温馨鼓励型</option>
            <option value="objective">客观分析型</option>
            <option value="positive">积极向上型</option>
            <option value="comprehensive">全面发展型</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">评语长度</label>
          <select
            value={length}
            onChange={e => onLengthChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="short">简洁版 (50-80字)</option>
            <option value="medium">标准版 (80-120字)</option>
            <option value="long">详细版 (120-180字)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
