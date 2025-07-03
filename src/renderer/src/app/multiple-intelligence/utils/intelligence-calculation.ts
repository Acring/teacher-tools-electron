import { StudentData } from '../types'
import { INTELLIGENCE_MAPPING } from '../templates/evaluation-templates'

// 生成学生的智能维度分数
export function calculateStudentIntelligence(student: StudentData): Record<string, number> {
  const intelligenceScores: Record<string, number> = {}

  Object.entries(INTELLIGENCE_MAPPING).forEach(([intelligence, subjects]) => {
    const scores = subjects
      .map((subject) => {
        // 精确匹配字段名或查找包含关键词的字段
        const matchingField = Object.keys(student).find(
          (key) => key === subject || key.includes(subject) || subject.includes(key)
        )
        const score = matchingField ? (student[matchingField] as number) : 0
        return typeof score === 'number' && !isNaN(score) ? score : 0
      })
      .filter((score) => score > 0)

    if (scores.length > 0) {
      intelligenceScores[intelligence] = scores.reduce((a, b) => a + b, 0) / scores.length
    } else {
      intelligenceScores[intelligence] = 0
    }
  })

  return intelligenceScores
}
