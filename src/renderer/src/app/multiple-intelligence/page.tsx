import { useState } from 'react'
import * as XLSX from 'xlsx'
import { IntelligenceData, StatisticsData, ChartType, CellValue, StudentData } from './types'
import FileUploader from './components/FileUploader'
import StatisticsOverview from './components/StatisticsOverview'
import ChartSection from './components/ChartSection'
import StatisticsTable from './components/StatisticsTable'
import OperationLogs from './components/OperationLogs'
import ReportExporter from './components/ReportExporter'

// 删除字符串中的引号
function removeQuotes(str: string): string {
  return str.replace(/["""''“”]/g, '')
}

export default function MultipleIntelligencePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testData, setTestData] = useState<IntelligenceData | null>(null)
  const [statistics, setStatistics] = useState<StatisticsData[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [activeChart, setActiveChart] = useState<ChartType>('overview')

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)
      addLog(`开始读取文件: ${file.name}`)

      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })

      if (workbook.SheetNames.length === 0) {
        addLog('文件中没有找到工作表')
        return
      }

      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as CellValue[][]

      // 解析数据结构
      const headers = jsonData[1] || [] // 第二行是表头
      const subHeaders = jsonData[2] || [] // 第三行是子表头

      addLog(`解析完成，表头有 ${headers.length} 列`)

      // 解析学生数据（从第4行开始，跳过空行）
      const studentRows = jsonData.slice(3).filter(
        (row) => row && row.length > 0 && row[0] && row[1] // 确保有班级和姓名
      )

      const parsedStudents: StudentData[] = studentRows.map((row) => {
        const student: StudentData = {
          班级: String(row[0] || ''),
          姓名: String(row[1] || '')
        }

        // 添加各个测评项目的成绩
        headers.slice(2).forEach((header, index) => {
          if (header && header !== null) {
            const cellIndex = index + 2
            const value = row[cellIndex]
            const subHeader = subHeaders[cellIndex]

            if (typeof value === 'number') {
              // 如果子表头存在，使用子表头作为字段名，并清理引号
              let fieldName = subHeader && subHeader !== null ? String(subHeader) : String(header)
              // 清理字段名中的引号
              fieldName = removeQuotes(fieldName)
              student[fieldName] = value
            }
          }
        })

        return student
      })
      console.log('parsedStudents', parsedStudents)

      const intelligenceData: IntelligenceData = {
        name: workbook.SheetNames[0],
        data: jsonData,
        headers: headers.map(String),
        parsedStudents
      }

      setTestData(intelligenceData)
      calculateStatistics(intelligenceData)
      addLog(`成功解析 ${parsedStudents.length} 名学生的测评数据`)
    } catch (error) {
      addLog(`文件读取失败: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStatistics = (data: IntelligenceData) => {
    const stats: StatisticsData[] = []

    // 获取所有评分字段（排除班级和姓名）
    const scoreFields = Object.keys(data.parsedStudents[0] || {}).filter(
      (key) => key !== '班级' && key !== '姓名'
    )

    scoreFields.forEach((field) => {
      const scores = data.parsedStudents
        .map((student) => student[field])
        .filter((score) => typeof score === 'number') as number[]

      if (scores.length > 0) {
        const sum = scores.reduce((a, b) => a + b, 0)
        const average = sum / scores.length
        const max = Math.max(...scores)
        const min = Math.min(...scores)

        stats.push({
          subjectName: field,
          average: Math.round(average * 100) / 100,
          max,
          min,
          count: scores.length
        })
      }
    })

    setStatistics(stats)
    addLog(`计算完成，共 ${stats.length} 个测评项目的统计数据`)
  }

  const clearData = () => {
    setTestData(null)
    setStatistics([])
    setActiveChart('overview')
    addLog('数据已清空')

    // 延迟清空日志，让用户能看到清空消息
    setTimeout(() => {
      setLogs([])
    }, 1000)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-4">
          <span className="text-3xl">🧠</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">学生多元智能测评</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          上传包含学生测评数据的 Excel 文件，自动生成班级统计分析图表
        </p>
      </div>

      {/* 文件上传区域 */}
      <FileUploader
        isLoading={isLoading}
        onFileUpload={handleFileUpload}
        onClearData={clearData}
        addLog={addLog}
      />

      {/* 数据统计概览 */}
      {testData && <StatisticsOverview testData={testData} statistics={statistics} />}

      {/* 图表展示区域 */}
      <ChartSection
        statistics={statistics}
        activeChart={activeChart}
        setActiveChart={setActiveChart}
        addLog={addLog}
      />

      {/* 详细统计表格 */}
      <StatisticsTable statistics={statistics} />

      {/* 学生测评报告导出 */}
      {testData && testData.parsedStudents.length > 0 && (
        <ReportExporter students={testData.parsedStudents} addLog={addLog} />
      )}

      {/* 操作日志 */}
      <OperationLogs logs={logs} />
    </div>
  )
}
