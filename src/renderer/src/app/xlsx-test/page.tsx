import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'

type CellValue = string | number | boolean | null | undefined

interface SheetData {
  name: string
  data: CellValue[][]
  headers: string[]
}

export default function XlsxTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sheets, setSheets] = useState<SheetData[]>([])
  const [activeSheet, setActiveSheet] = useState(0)
  const [testResults, setTestResults] = useState<string[]>([])
  const [showJson, setShowJson] = useState(false)
  const [jsonViewMode, setJsonViewMode] = useState<'pretty' | 'compact'>('pretty')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addTestResult = (message: string) => {
    setTestResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)
      addTestResult(`开始读取文件: ${file.name}`)

      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })

      addTestResult(`文件读取成功，共 ${workbook.SheetNames.length} 个工作表`)

      const sheetsData: SheetData[] = workbook.SheetNames.map((sheetName) => {
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as CellValue[][]

        // 提取表头（第一行）
        const headers = jsonData[0] || []
        // 数据行（从第二行开始）
        const data = jsonData.slice(1)

        addTestResult(`工作表 "${sheetName}": ${headers.length} 列, ${data.length} 行数据`)

        return {
          name: sheetName,
          data: jsonData,
          headers: headers.map(String)
        }
      })

      setSheets(sheetsData)
      setActiveSheet(0)
      addTestResult('Excel 文件解析完成')
    } catch (error) {
      addTestResult(`文件读取失败: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const generateSampleFile = () => {
    try {
      addTestResult('开始生成示例 Excel 文件...')

      // 创建示例数据
      const studentData = [
        ['姓名', '年龄', '班级', '成绩', '备注'],
        ['张三', 12, '一年级3班', 95, '表现优秀'],
        ['李四', 11, '一年级3班', 88, '需要加强数学'],
        ['王五', 12, '一年级3班', 92, '积极参与课堂'],
        ['赵六', 11, '一年级3班', 87, '书写工整'],
        ['钱七', 12, '一年级3班', 94, '乐于助人']
      ]

      const scoreData = [
        ['科目', '平均分', '最高分', '最低分', '及格率'],
        ['语文', 89.5, 98, 75, '95%'],
        ['数学', 85.2, 100, 68, '90%'],
        ['英语', 91.3, 99, 80, '98%'],
        ['科学', 87.8, 96, 72, '92%']
      ]

      // 创建工作簿
      const workbook = XLSX.utils.book_new()

      // 添加学生信息表
      const studentSheet = XLSX.utils.aoa_to_sheet(studentData)
      XLSX.utils.book_append_sheet(workbook, studentSheet, '学生信息')

      // 添加成绩统计表
      const scoreSheet = XLSX.utils.aoa_to_sheet(scoreData)
      XLSX.utils.book_append_sheet(workbook, scoreSheet, '成绩统计')

      // 生成文件并下载
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `示例数据-${Date.now()}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      addTestResult('示例 Excel 文件生成并下载成功')
    } catch (error) {
      addTestResult(`示例文件生成失败: ${error}`)
    }
  }

  const clearResults = () => {
    setTestResults([])
    setSheets([])
    setActiveSheet(0)
    setShowJson(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const copyJsonToClipboard = () => {
    if (sheets[activeSheet]) {
      const jsonStr = JSON.stringify(sheets[activeSheet], null, jsonViewMode === 'pretty' ? 2 : 0)
      navigator.clipboard
        .writeText(jsonStr)
        .then(() => {
          addTestResult('JSON 数据已复制到剪贴板')
        })
        .catch(() => {
          addTestResult('复制失败，请手动选择复制')
        })
    }
  }

  const renderTable = (sheetData: SheetData) => {
    if (!sheetData.data.length) {
      return <div className="text-gray-500 text-center py-8">暂无数据</div>
    }

    return (
      <div className="overflow-auto max-h-96">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {sheetData.data[0]?.map((header, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-900"
                >
                  {header || `列 ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheetData.data.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border border-gray-300 px-4 py-2 text-sm text-gray-700"
                  >
                    {cell !== null && cell !== undefined ? String(cell) : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderJsonView = (sheetData: SheetData) => {
    const jsonStr = JSON.stringify(sheetData, null, jsonViewMode === 'pretty' ? 2 : 0)

    return (
      <div className="bg-gray-900 rounded-md p-4 overflow-auto max-h-96">
        <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap break-words">
          {jsonStr}
        </pre>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-4">
          <span className="text-3xl">📊</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Excel 文件测试页面</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          上传并读取 Excel 文件，展示工作表内容和 JSON 数据结构
        </p>
      </div>

      {/* File Upload Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">文件操作</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {isLoading && <span className="text-blue-600">📂 读取中...</span>}
          </div>
          <button
            onClick={generateSampleFile}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            📄 生成示例文件
          </button>
          <button
            onClick={clearResults}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            🗑️ 清空结果
          </button>
        </div>
      </div>

      {/* Sheets Display */}
      {sheets.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">工作表内容</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowJson(!showJson)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    showJson
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {showJson ? '📋 表格视图' : '📋 JSON 视图'}
                </button>
                {showJson && (
                  <>
                    <select
                      value={jsonViewMode}
                      onChange={(e) => setJsonViewMode(e.target.value as 'pretty' | 'compact')}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="pretty">格式化</option>
                      <option value="compact">紧凑</option>
                    </select>
                    <button
                      onClick={copyJsonToClipboard}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                    >
                      📋 复制 JSON
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sheet Tabs */}
          {sheets.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200">
              {sheets.map((sheet, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSheet(index)}
                  className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                    activeSheet === index
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sheet.name}
                </button>
              ))}
            </div>
          )}

          {/* Sheet Content */}
          {sheets[activeSheet] && (
            <div>
              <div className="mb-4 text-sm text-gray-600">
                工作表: <span className="font-medium">{sheets[activeSheet].name}</span> | 行数:{' '}
                <span className="font-medium">{sheets[activeSheet].data.length}</span> | 列数:{' '}
                <span className="font-medium">{sheets[activeSheet].data[0]?.length || 0}</span>
              </div>

              {showJson ? renderJsonView(sheets[activeSheet]) : renderTable(sheets[activeSheet])}
            </div>
          )}
        </div>
      )}

      {/* Test Results Log */}
      {testResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">操作日志</h2>
          <div className="bg-gray-50 rounded-md p-4 max-h-60 overflow-y-auto">
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm text-gray-700 font-mono">
                  {result}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
