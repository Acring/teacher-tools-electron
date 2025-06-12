'use client';

import { useState } from 'react';
import { BorderTemplate, BorderConfig } from '../utils/export-utils';

interface BorderTemplateSelectorProps {
  value?: BorderConfig;
  onChange: (borderConfig: BorderConfig) => void;
}

// 边框模版描述
const TEMPLATE_DESCRIPTIONS = {
  none: { name: '无边框', description: '无边框样式' },
  simple: { name: '简单边框', description: '黑色细线边框' },
  double: { name: '双线边框', description: '黑色双线边框' },
  dotted: { name: '点线边框', description: '灰色点线边框' },
  dashed: { name: '虚线边框', description: '灰色虚线边框' },
  thick: { name: '粗线边框', description: '深灰色粗线边框' },
  decorative: { name: '装饰边框', description: '蓝色双线装饰边框' },
};

// 边框预览样式映射
const PREVIEW_STYLES = {
  none: 'border-none',
  simple: 'border border-gray-800',
  double: 'border-4 border-double border-gray-800',
  dotted: 'border-2 border-dotted border-gray-500',
  dashed: 'border-2 border-dashed border-gray-500',
  thick: 'border-4 border-gray-700',
  decorative: 'border-4 border-double border-blue-600',
};

export default function BorderTemplateSelector({ value, onChange }: BorderTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<BorderTemplate>(
    value?.template || 'simple'
  );
  const [customColor, setCustomColor] = useState(value?.color || '');
  const [customSize, setCustomSize] = useState(value?.size?.toString() || '');

  const handleTemplateChange = (template: BorderTemplate) => {
    setSelectedTemplate(template);
    onChange({
      template,
      color: customColor || undefined,
      size: customSize ? parseInt(customSize) : undefined,
    });
  };

  const handleCustomChange = () => {
    onChange({
      template: selectedTemplate,
      color: customColor || undefined,
      size: customSize ? parseInt(customSize) : undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">边框模版</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {(Object.keys(TEMPLATE_DESCRIPTIONS) as BorderTemplate[]).map(template => {
            const desc = TEMPLATE_DESCRIPTIONS[template];
            const isSelected = selectedTemplate === template;

            return (
              <div
                key={template}
                className={`relative cursor-pointer rounded-lg border-2 p-3 transition-colors ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTemplateChange(template)}
              >
                {/* 边框预览 */}
                <div
                  className={`w-full h-12 mb-2 rounded ${PREVIEW_STYLES[template]} bg-white flex items-center justify-center text-xs text-gray-600`}
                >
                  预览
                </div>

                {/* 模版信息 */}
                <div className="text-center">
                  <div className="font-medium text-sm text-gray-900">{desc.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{desc.description}</div>
                </div>

                {/* 选中标识 */}
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 自定义选项 */}
      {selectedTemplate !== 'none' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">自定义设置（可选）</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 自定义颜色 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">边框颜色</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={customColor ? `#${customColor}` : '#000000'}
                  onChange={e => {
                    const color = e.target.value.replace('#', '');
                    setCustomColor(color);
                  }}
                  onBlur={handleCustomChange}
                  className="w-10 h-8 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={e => setCustomColor(e.target.value.replace('#', ''))}
                  onBlur={handleCustomChange}
                  placeholder="自动选择"
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">留空使用默认颜色，格式：000000（不含#）</p>
            </div>

            {/* 自定义粗细 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">边框粗细</label>
              <input
                type="number"
                value={customSize}
                onChange={e => setCustomSize(e.target.value)}
                onBlur={handleCustomChange}
                placeholder="自动选择"
                min="1"
                max="20"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">留空使用默认粗细，范围：1-20</p>
            </div>
          </div>
        </div>
      )}

      {/* 效果说明 */}
      <div className="bg-blue-50 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <svg
            className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-sm text-blue-700 font-medium">边框效果说明</p>
            <p className="text-xs text-blue-600 mt-1">
              边框将应用到导出的DOCX文档中的每个评语框。不同模版适合不同场景：
              简单边框适合正式文档，装饰边框适合展示用途，虚线边框适合草稿等。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
