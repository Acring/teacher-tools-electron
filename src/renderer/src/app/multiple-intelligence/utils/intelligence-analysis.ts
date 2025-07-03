import { EVALUATION_TEMPLATES } from '../templates/evaluation-templates'

// 分析学生的优势和弱势智能
export function analyzeStudentIntelligence(intelligenceScores: Record<string, number>) {
  const entries = Object.entries(intelligenceScores)
  const sortedByScore = entries.sort((a, b) => b[1] - a[1])

  // 获取前2个作为优势智能
  const strengths = sortedByScore.slice(0, 2).map(([intelligence]) => intelligence)

  // 获取后2个作为弱势智能（只选择分数低于平均分的）
  const averageScore = entries.reduce((sum, [, score]) => sum + score, 0) / entries.length
  const weaknesses = sortedByScore
    .filter(([, score]) => score < averageScore)
    .slice(-2)
    .map(([intelligence]) => intelligence)

  return { strengths, weaknesses }
}

// 生成评价文本
export function generateEvaluation(
  intelligences: string[],
  type: '优势智能' | '弱势智能' | '提升策略'
): string {
  const evaluations: string[] = []

  intelligences.forEach((intelligence) => {
    const templates = EVALUATION_TEMPLATES[type][intelligence]
    if (templates && templates.length > 0) {
      // 随机选择一个模板
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
      evaluations.push(randomTemplate)
    }
  })

  return evaluations.join('；') + '。'
}
