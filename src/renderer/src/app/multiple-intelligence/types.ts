export type CellValue = string | number | boolean | null | undefined

export interface StudentData {
  班级: string
  姓名: string
  [key: string]: CellValue
}

export interface IntelligenceData {
  name: string
  data: CellValue[][]
  headers: string[]
  parsedStudents: StudentData[]
}

export interface StatisticsData {
  subjectName: string
  average: number
  max: number
  min: number
  count: number
  passRate: number
}

export type ChartType = 'overview' | 'average' | 'distribution' | 'ranking'
