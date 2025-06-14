import { EvaluationTags } from '@renderer/type/student'
import { TAG_OPTIONS } from '@renderer/constants/evaluation-tags'
import {
  COMMENT_TEMPLATES,
  IMPROVEMENT_TEMPLATES,
  COMMENT_GENERATION_CONFIG
} from '@renderer/constants/comment-templates'

/**
 * 简单的评语生成器
 */
export class SimpleCommentGenerator {
  /**
   * 为学生生成评语
   */
  static generateComment(
    studentName: string,
    evaluationTags: EvaluationTags
  ): { comment: string; usedTags: string[] } {
    // 获取所有标签
    const allTags = this.getAllTags(evaluationTags)

    if (allTags.length === 0) {
      return {
        comment: this.getDefaultComment(studentName),
        usedTags: []
      }
    }

    // 随机选择2-3个标签
    const selectedTags = this.selectRandomTags(
      allTags,
      COMMENT_GENERATION_CONFIG.tagSelectionRange.min,
      COMMENT_GENERATION_CONFIG.tagSelectionRange.max
    )
    console.log('selectedTags', selectedTags)

    // 生成评语
    return {
      comment: this.assembleComment(studentName, selectedTags),
      usedTags: selectedTags
    }
  }

  /**
   * 获取学生所有标签
   */
  private static getAllTags(evaluationTags: EvaluationTags): string[] {
    const allTags: string[] = []
    Object.values(evaluationTags).forEach((tags) => {
      if (Array.isArray(tags)) {
        allTags.push(...tags)
      }
    })
    return allTags
  }

  /**
   * 随机选择标签
   */
  private static selectRandomTags(tags: string[], min: number, max: number): string[] {
    const count = Math.min(Math.floor(Math.random() * (max - min + 1)) + min, tags.length)
    const shuffled = [...tags].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  /**
   * 判断是否为正面标签
   */
  private static isPositiveTag(tag: string): boolean {
    return Object.values(TAG_OPTIONS).some((category) => category.positive.includes(tag))
  }

  /**
   * 组装评语
   */
  private static assembleComment(studentName: string, tags: string[]): string {
    let comment = `${studentName}同学\n`

    const positiveTags = tags.filter((tag) => this.isPositiveTag(tag))
    const negativeTags = tags.filter((tag) => !this.isPositiveTag(tag))

    // 添加正面评价
    if (positiveTags.length > 0) {
      const positiveComments = positiveTags
        .map((tag) => this.getTemplateForTag(tag, true))
        .filter(Boolean)

      if (positiveComments.length > 0) {
        comment += positiveComments[0]

        // 连接多个正面评价
        for (let i = 1; i < positiveComments.length; i++) {
          const connector =
            COMMENT_GENERATION_CONFIG.connectors[
              Math.floor(Math.random() * COMMENT_GENERATION_CONFIG.connectors.length)
            ]
          comment += connector + positiveComments[i]
        }
      }
    }

    // 添加改进建议
    if (negativeTags.length > 0) {
      const negativeComments = negativeTags
        .map((tag) => this.getTemplateForTag(tag, false))
        .filter(Boolean)

      if (negativeComments.length > 0) {
        if (positiveTags.length > 0) {
          comment += '。但是'
        }
        comment += negativeComments[0]

        for (let i = 1; i < negativeComments.length; i++) {
          comment += '，同时' + negativeComments[i]
        }
      }
    }

    // 添加结尾
    const closing =
      COMMENT_GENERATION_CONFIG.closings[
        Math.floor(Math.random() * COMMENT_GENERATION_CONFIG.closings.length)
      ]
    comment += '。' + closing

    return comment
  }

  /**
   * 获取标签对应的模板
   */
  private static getTemplateForTag(tag: string, isPositive: boolean): string | null {
    const templates = isPositive ? COMMENT_TEMPLATES : IMPROVEMENT_TEMPLATES

    // 遍历所有分类查找标签
    for (const categoryTemplates of Object.values(templates)) {
      if (categoryTemplates[tag] && categoryTemplates[tag].length > 0) {
        const tagTemplates = categoryTemplates[tag]
        return tagTemplates[Math.floor(Math.random() * tagTemplates.length)]
      }
    }

    return null
  }

  /**
   * 获取默认评语（当学生没有标签时使用拼接方式生成）
   */
  private static getDefaultComment(studentName: string): string {
    // 获取所有可用的正向模板
    const allPositiveTemplates: string[] = []
    Object.values(COMMENT_TEMPLATES).forEach((category) => {
      Object.values(category).forEach((templates) => {
        allPositiveTemplates.push(...templates)
      })
    })

    // 获取所有可用的改进建议模板
    const allImprovementTemplates: string[] = []
    Object.values(IMPROVEMENT_TEMPLATES).forEach((category) => {
      Object.values(category).forEach((templates) => {
        allImprovementTemplates.push(...templates)
      })
    })

    let comment = `${studentName}同学\n`

    // 随机选择两个不同的正向评价
    if (allPositiveTemplates.length > 0) {
      // 打乱数组并选择两个不同的评价
      const shuffledTemplates = [...allPositiveTemplates].sort(() => Math.random() - 0.5)
      const firstPositive = shuffledTemplates[0]
      comment += firstPositive

      // 如果有第二个评价可选，添加连接词并加入第二个评价
      if (shuffledTemplates.length > 1) {
        const connector =
          COMMENT_GENERATION_CONFIG.connectors[
            Math.floor(Math.random() * COMMENT_GENERATION_CONFIG.connectors.length)
          ]
        const secondPositive = shuffledTemplates[1]
        comment += connector + secondPositive
      }
    }

    // 随机选择一个改进建议
    if (allImprovementTemplates.length > 0) {
      const randomImprovement =
        allImprovementTemplates[Math.floor(Math.random() * allImprovementTemplates.length)]
      comment += '。但是' + randomImprovement
    }

    // 添加结尾
    const closing =
      COMMENT_GENERATION_CONFIG.closings[
        Math.floor(Math.random() * COMMENT_GENERATION_CONFIG.closings.length)
      ]
    comment += '。' + closing

    return comment
  }

  /**
   * 批量生成评语
   */
  static async generateBatchComments(
    students: Array<{ id: string; name: string; evaluationTags?: EvaluationTags }>,
    onProgress?: (completed: number, total: number) => void
  ): Promise<{ [key: string]: { comment: string; usedTags: string[] } }> {
    const comments: { [key: string]: { comment: string; usedTags: string[] } } = {}

    for (let i = 0; i < students.length; i++) {
      const student = students[i]

      // 模拟生成延迟
      await new Promise((resolve) => setTimeout(resolve, 300))

      // 生成评语
      comments[student.id] = this.generateComment(
        student.name,
        student.evaluationTags || {
          characteristics: [],
          discipline: [],
          academic: [],
          homework: [],
          physicalLabor: []
        }
      )

      // 通知进度
      if (onProgress) {
        onProgress(i + 1, students.length)
      }
    }

    return comments
  }
}
