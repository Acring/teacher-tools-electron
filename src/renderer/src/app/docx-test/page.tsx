import { useState } from 'react'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun } from 'docx'

export default function DocxTestPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])

  const addTestResult = (message: string) => {
    setTestResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  // 测试基本Canvas图片生成
  const testCanvasImageGeneration = async () => {
    try {
      addTestResult('开始测试Canvas图片生成...')

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      // 设置画布大小
      canvas.width = 800
      canvas.height = 200

      // 清空画布，设置白色背景
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 绘制花卉边框
      ctx.strokeStyle = '#8B4513'
      ctx.lineWidth = 4

      // 外边框
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

      // 花朵装饰
      const drawFlower = (x: number, y: number, size: number) => {
        ctx.fillStyle = '#FF69B4'
        for (let i = 0; i < 6; i++) {
          const angle = (i * 60 * Math.PI) / 180
          const petalX = x + Math.cos(angle) * size
          const petalY = y + Math.sin(angle) * size
          ctx.beginPath()
          ctx.arc(petalX, petalY, size / 2, 0, 2 * Math.PI)
          ctx.fill()
        }
        // 花心
        ctx.fillStyle = '#FFD700'
        ctx.beginPath()
        ctx.arc(x, y, size / 3, 0, 2 * Math.PI)
        ctx.fill()
      }

      // 在四个角添加花朵
      drawFlower(30, 30, 12)
      drawFlower(canvas.width - 30, 30, 12)
      drawFlower(30, canvas.height - 30, 12)
      drawFlower(canvas.width - 30, canvas.height - 30, 12)

      // 顶部和底部添加小花
      for (let i = 100; i < canvas.width - 100; i += 80) {
        drawFlower(i, 25, 8)
        drawFlower(i, canvas.height - 25, 8)
      }

      const imageData = canvas.toDataURL('image/png')
      addTestResult(`Canvas图片生成成功，大小: ${canvas.width}x${canvas.height}`)

      return imageData
    } catch (error) {
      addTestResult(`Canvas图片生成失败: ${error}`)
      return null
    }
  }

  // 测试基本DOCX文档创建
  const testBasicDocumentCreation = async () => {
    try {
      setIsGenerating(true)
      addTestResult('开始测试基本DOCX文档创建...')

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: '测试文档标题',
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: '这是一个测试段落，用于验证基本的文档创建功能。',
                    size: 24
                  })
                ],
                spacing: { after: 200 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: '张三：你总是那么热心肠，帮助同学时的样子真让老师骄傲。',
                    size: 24
                  })
                ],
                spacing: { after: 200 }
              })
            ]
          }
        ]
      })

      const blob = await Packer.toBlob(doc)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `docx-test-basic-${Date.now()}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      addTestResult('基本DOCX文档创建成功并下载')
    } catch (error) {
      addTestResult(`基本DOCX文档创建失败: ${error}`)
    } finally {
      setIsGenerating(false)
    }
  }

  // 测试带图片的DOCX文档
  const testDocumentWithImage = async () => {
    try {
      setIsGenerating(true)
      addTestResult('开始测试带图片的DOCX文档...')

      // 生成Canvas图片
      const imageData = await testCanvasImageGeneration()
      if (!imageData) {
        addTestResult('图片生成失败，无法继续测试')
        return
      }

      // 将base64转换为Uint8Array
      const base64Data = imageData.split(',')[1]
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      addTestResult('图片数据转换完成')

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: '带图片的测试文档',
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: '下面应该显示花卉边框图片',
                    size: 24
                  })
                ],
                spacing: { after: 200 }
              }),
              new Paragraph({
                children: [
                  new ImageRun({
                    data: bytes,
                    transformation: {
                      width: 400,
                      height: 100
                    },
                    type: 'png'
                  })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: '图片测试完成',
                    size: 24
                  })
                ]
              })
            ]
          }
        ]
      })

      const blob = await Packer.toBlob(doc)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `docx-test-with-image-${Date.now()}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      addTestResult('带图片的DOCX文档创建成功并下载')
    } catch (error) {
      addTestResult(`带图片的DOCX文档创建失败: ${error}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-lg mb-4">
          <span className="text-3xl">📄</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">DOCX 测试页面</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          测试 DOCX 文档生成功能，包括基本文档创建和图片插入
        </p>
      </div>

      {/* Test Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">测试功能</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={testBasicDocumentCreation}
            disabled={isGenerating}
            className="px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? '生成中...' : '📄 基本文档测试'}
          </button>
          <button
            onClick={testDocumentWithImage}
            disabled={isGenerating}
            className="px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? '生成中...' : '🖼️ 图片文档测试'}
          </button>
          <button
            onClick={testCanvasImageGeneration}
            disabled={isGenerating}
            className="px-4 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            🎨 Canvas图片测试
          </button>
          <button
            onClick={clearResults}
            className="px-4 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            🗑️ 清空结果
          </button>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">测试结果</h2>
        <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500 text-center py-8">点击上方按钮开始测试</p>
          ) : (
            <div className="space-y-1 font-mono text-sm">
              {testResults.map((result, index) => (
                <div key={index} className="text-gray-700">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Usage Tips */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-900 mb-2">💡 使用说明</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 基本文档测试：创建包含标题和段落的简单DOCX文档</li>
          <li>• 图片文档测试：创建包含Canvas生成图片的DOCX文档</li>
          <li>• Canvas图片测试：仅测试Canvas图片生成功能</li>
          <li>• 所有生成的文档都会自动下载到本地</li>
          <li>• 测试结果会显示在下方的结果框中</li>
        </ul>
      </div>
    </div>
  )
}
