import { StudentData } from '../types'
import { Packer } from 'docx'
import JSZip from 'jszip'
import { calculateStudentIntelligence } from './intelligence-calculation'
import { generateRadarChart } from './chart-generation'
import { analyzeStudentIntelligence, generateEvaluation } from './intelligence-analysis'
import { createReportDocument } from './document-creation'

// 导出单个学生报告
export async function exportStudentReport(
  student: StudentData,
  addLog: (message: string) => void,
  returnBlob: boolean = false,
  mainTitle: string = '宝安中学（集团）实验学校 2024 至 2025 学年度第二学期小学部',
  subTitle: string = '一年级指向多元智能发展的个性化综合测评报告'
): Promise<Blob | void> {
  try {
    addLog(`开始生成 ${student.姓名} 的测评报告...`)

    // 计算智能分数
    const intelligenceScores = calculateStudentIntelligence(student)
    addLog(`计算智能分数完成`)

    // 分析优势和弱势
    const { strengths, weaknesses } = analyzeStudentIntelligence(intelligenceScores)
    addLog(`分析优势弱势完成：优势-${strengths.join('、')}，弱势-${weaknesses.join('、')}`)

    // 生成雷达图
    const radarChartData = await generateRadarChart(intelligenceScores, student.姓名)
    addLog(`雷达图生成完成`)

    // 将base64转换为Uint8Array
    const base64Data = radarChartData.split(',')[1]
    const binaryString = atob(base64Data)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // 生成评价文本
    const strengthEvaluation = generateEvaluation(strengths, '优势智能')
    const weaknessEvaluation = generateEvaluation(weaknesses, '弱势智能')
    const strategyEvaluation = generateEvaluation([...weaknesses], '提升策略')

    // 创建Word文档
    const doc = createReportDocument(
      student,
      bytes,
      strengthEvaluation,
      weaknessEvaluation,
      strategyEvaluation,
      mainTitle,
      subTitle
    )

    // 导出文档
    const blob = await Packer.toBlob(doc)

    if (returnBlob) {
      addLog(`${student.姓名} 的测评报告生成完成`)
      return blob
    } else {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${student.班级}-${student.姓名}-多元智能测评报告.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      addLog(`${student.姓名} 的测评报告生成完成并下载`)
    }
  } catch (error) {
    addLog(`${student.姓名} 的测评报告生成失败: ${error}`)
    throw error
  }
}

// 批量导出所有学生报告
export async function batchExportReports(
  students: StudentData[],
  addLog: (message: string) => void,
  onProgress?: (current: number, total: number) => void,
  mainTitle?: string,
  subTitle?: string
): Promise<void> {
  addLog(`开始批量导出 ${students.length} 名学生的测评报告...`)

  const zip = new JSZip()
  const successfulReports: Array<{ student: StudentData; blob: Blob }> = []

  for (let i = 0; i < students.length; i++) {
    const student = students[i]
    try {
      const blob = (await exportStudentReport(student, addLog, true, mainTitle, subTitle)) as Blob

      if (blob) {
        successfulReports.push({ student, blob })
        addLog(`${student.姓名} 的报告已准备好打包`)
      }
      onProgress?.(i + 1, students.length)

      // 添加延迟避免浏览器冻结
      if (i < students.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 300))
      }
    } catch (error) {
      addLog(`跳过 ${student.姓名}，继续处理下一个学生: ${error}`)
      onProgress?.(i + 1, students.length)
    }
  }

  // 将所有成功生成的报告添加到 zip 文件中
  if (successfulReports.length > 0) {
    addLog(`开始打包 ${successfulReports.length} 个报告到 zip 文件...`)

    for (const { student, blob } of successfulReports) {
      const fileName = `${student.班级}-${student.姓名}-多元智能测评报告.docx`
      zip.file(fileName, blob)
    }

    // 生成 zip 文件并下载
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `多元智能测评报告-${new Date().toISOString().split('T')[0]}.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    addLog(`批量导出完成！成功打包 ${successfulReports.length} 个报告`)
  } else {
    addLog(`没有成功生成任何报告，请检查数据`)
  }
}
