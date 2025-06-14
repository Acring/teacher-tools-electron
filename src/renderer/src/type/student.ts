// 评价标签类型定义
export interface EvaluationTags {
  // 学生特点
  characteristics: string[]
  // 纪律表现
  discipline: string[]
  // 学习成绩
  academic: string[]
  // 作业情况
  homework: string[]
  // 体育劳动
  physicalLabor: string[]
}

// 学生接口定义
export interface Student {
  id: string
  name: string
  evaluationTags?: EvaluationTags
}
