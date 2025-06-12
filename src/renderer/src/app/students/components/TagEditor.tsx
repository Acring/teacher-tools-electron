import { Student, EvaluationTags } from '../../../type/student';
import { TAG_OPTIONS, EXCLUSIVE_TAG_GROUPS } from '../../../constants/evaluation-tags';

interface TagEditorProps {
  isOpen: boolean;
  student: Student | null;
  editingTags: EvaluationTags | null;
  onClose: () => void;
  onSave: () => void;
  onSaveAndNext: () => void;
  onToggleTag: (category: keyof EvaluationTags, tag: string) => void;
  hasNextStudent: boolean;
}

export default function TagEditor({
  isOpen,
  student,
  editingTags,
  onClose,
  onSave,
  onSaveAndNext,
  onToggleTag,
  hasNextStudent,
}: TagEditorProps) {
  if (!isOpen || !student || !editingTags) return null;

  // 检查标签是否与已选标签互斥
  const isTagExclusive = (tag: string, currentTags: string[]): boolean => {
    for (const group of EXCLUSIVE_TAG_GROUPS) {
      if (group.includes(tag)) {
        // 检查是否有其他同组标签已被选择
        return currentTags.some(selectedTag => group.includes(selectedTag) && selectedTag !== tag);
      }
    }
    return false;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">编辑标签 - {student.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {Object.entries(TAG_OPTIONS).map(([category, options]) => {
            const categoryKey = category as keyof EvaluationTags;
            const categoryNames = {
              characteristics: '学生特点',
              discipline: '纪律表现',
              academic: '学习成绩',
              homework: '作业情况',
              physicalLabor: '体育劳动',
            };

            const selectedTags = editingTags[categoryKey] || [];
            const allCurrentTags = [
              ...editingTags.characteristics,
              ...editingTags.discipline,
              ...editingTags.academic,
              ...editingTags.homework,
              ...editingTags.physicalLabor,
            ];

            return (
              <div key={category} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{categoryNames[categoryKey]}</h3>

                {/* Positive Tags */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-green-700 mb-2">正面评价</h4>
                  <div className="flex flex-wrap gap-2">
                    {options.positive.map(tag => {
                      const isSelected = selectedTags.includes(tag);
                      const isDisabled = !isSelected && isTagExclusive(tag, allCurrentTags);

                      return (
                        <button
                          key={tag}
                          onClick={() => !isDisabled && onToggleTag(categoryKey, tag)}
                          disabled={isDisabled}
                          className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            isSelected
                              ? 'bg-green-500 text-white'
                              : isDisabled
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Negative Tags */}
                <div>
                  <h4 className="text-sm font-medium text-red-700 mb-2">待改进</h4>
                  <div className="flex flex-wrap gap-2">
                    {options.negative.map(tag => {
                      const isSelected = selectedTags.includes(tag);
                      const isDisabled = !isSelected && isTagExclusive(tag, allCurrentTags);

                      return (
                        <button
                          key={tag}
                          onClick={() => !isDisabled && onToggleTag(categoryKey, tag)}
                          disabled={isDisabled}
                          className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            isSelected
                              ? 'bg-red-500 text-white'
                              : isDisabled
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          {hasNextStudent && (
            <button
              onClick={onSaveAndNext}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              保存并编辑下一个
            </button>
          )}
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
