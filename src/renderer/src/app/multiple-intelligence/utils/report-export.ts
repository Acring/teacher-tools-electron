import { StudentData } from '../types'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  VerticalAlign
} from 'docx'

// 智能维度映射
export const INTELLIGENCE_MAPPING = {
  言语语言智能: ['语文', '英语'],
  逻辑数理智能: ['数学'],
  自然观察智能: ['科学'],
  视觉空间智能: ['科创', '美术'],
  身体运动智能: ['体育'],
  内省智能: ['劳动']
}

// 评价模板
export const EVALUATION_TEMPLATES = {
  优势智能: {
    言语语言智能: [
      '语言表达能力突出，善于用词汇表达思想',
      '阅读理解能力强，能够深入理解文本内容',
      '写作能力优秀，文字表达生动有趣',
      '口语表达流畅，善于与他人沟通交流'
    ],
    逻辑数理智能: [
      '数学思维敏捷，善于运用逻辑推理',
      '计算能力强，对数字敏感度高',
      '问题解决能力突出，善于分析和总结',
      '抽象思维能力优秀，能理解复杂概念'
    ],
    自然观察智能: [
      '观察能力敏锐，善于发现自然规律',
      '对科学实验充满兴趣，动手能力强',
      '环境适应能力好，热爱自然探索',
      '分类整理能力强，善于归纳总结'
    ],
    视觉空间智能: [
      '空间想象力丰富，艺术创作能力强',
      '色彩感知敏锐，美术表现力突出',
      '设计思维活跃，创新意识强',
      '手工制作精巧，动手实践能力优秀'
    ],
    身体运动智能: [
      '身体协调性好，运动技能掌握快',
      '体能素质优秀，运动表现突出',
      '团队合作意识强，体育精神佳',
      '身体控制能力强，动作准确到位'
    ],
    内省智能: [
      '自我认知清晰，善于反思总结',
      '情绪管理能力强，心理素质好',
      '责任感强，做事认真负责',
      '独立思考能力强，有自己的见解'
    ]
  },

  弱势智能: {
    言语语言智能: [
      '语言表达需要进一步提升，可多练习口语交流',
      '阅读理解有待加强，建议增加阅读量',
      '写作表达还需完善，可多进行写作练习'
    ],
    逻辑数理智能: [
      '数学思维需要加强训练，可多做逻辑推理题',
      '计算准确性有待提高，需要加强基础练习',
      '抽象思维能力需要培养，可通过游戏等方式练习'
    ],
    自然观察智能: [
      '观察能力需要培养，建议多参与科学实验',
      '对自然现象的兴趣需要激发，可多进行户外观察',
      '科学探究精神有待加强，鼓励多提问和实践'
    ],
    视觉空间智能: [
      '空间想象力需要训练，可通过拼图等游戏提升',
      '艺术表现力有待开发，建议多参与美术活动',
      '创新思维需要培养，鼓励多进行创意制作'
    ],
    身体运动智能: [
      '身体协调性需要加强，可多进行体育锻炼',
      '运动技能需要练习，建议参与更多体育活动',
      '体能素质有待提高，需要坚持日常锻炼'
    ],
    内省智能: [
      '自我认知需要加强，建议多进行反思总结',
      '情绪管理能力有待提升，可学习情绪调节方法',
      '独立思考能力需要培养，鼓励表达自己的想法'
    ]
  },

  提升策略: {
    言语语言智能: [
      '增加课外阅读，培养语感和理解能力',
      '多参与课堂讨论，提升口语表达能力',
      '坚持写作练习，记录生活感悟',
      '参加演讲比赛，锻炼公众表达能力'
    ],
    逻辑数理智能: [
      '多做数学游戏，在趣味中提升逻辑思维',
      '练习口算和心算，提高计算准确性',
      '学习编程思维，培养逻辑推理能力',
      '参与数学竞赛，挑战更高难度题目'
    ],
    自然观察智能: [
      '多参与科学实验，培养观察和探究能力',
      '进行自然观察日记，记录发现的规律',
      '参观科技馆和自然博物馆，拓展科学视野',
      '种植小植物，观察生长变化过程'
    ],
    视觉空间智能: [
      '多进行美术创作，发挥想象力和创造力',
      '玩拼图和积木游戏，训练空间思维',
      '学习手工制作，提升动手实践能力',
      '参观美术馆和艺术展，提升艺术鉴赏力'
    ],
    身体运动智能: [
      '坚持每日体育锻炼，提升身体素质',
      '学习新的运动技能，如游泳、球类等',
      '参与团体运动，培养合作精神',
      '练习身体协调性动作，如舞蹈、体操等'
    ],
    内省智能: [
      '养成反思习惯，每日总结学习和生活',
      '学习情绪管理技巧，提升心理素质',
      '培养独立思考能力，勇于表达自己的观点',
      '参与志愿服务活动，培养社会责任感'
    ]
  }
}

// 生成学生的智能维度分数
export function calculateStudentIntelligence(student: StudentData): Record<string, number> {
  const intelligenceScores: Record<string, number> = {}

  Object.entries(INTELLIGENCE_MAPPING).forEach(([intelligence, subjects]) => {
    const scores = subjects
      .map((subject) => {
        // 查找匹配的科目字段
        const matchingField = Object.keys(student).find(
          (key) => key.includes(subject) && typeof student[key] === 'number'
        )
        return matchingField ? (student[matchingField] as number) : 0
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

// 生成雷达图
export function generateRadarChart(
  intelligenceScores: Record<string, number>,
  studentName?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      canvas.width = 600
      canvas.height = 600

      // 设置背景色
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const maxRadius = 200

      // 智能维度名称
      const intelligenceNames = Object.keys(INTELLIGENCE_MAPPING)
      const scores = intelligenceNames.map((name) => intelligenceScores[name] || 0)
      const maxScore = 5 // 假设最高分是5分

      // 绘制背景网格
      ctx.strokeStyle = '#e0e0e0'
      ctx.lineWidth = 1
      for (let i = 1; i <= 5; i++) {
        const radius = (maxRadius * i) / 5
        ctx.beginPath()
        for (let j = 0; j < intelligenceNames.length; j++) {
          const angle = (j * 2 * Math.PI) / intelligenceNames.length - Math.PI / 2
          const x = centerX + Math.cos(angle) * radius
          const y = centerY + Math.sin(angle) * radius
          if (j === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.stroke()
      }

      // 绘制轴线
      ctx.strokeStyle = '#ccc'
      for (let i = 0; i < intelligenceNames.length; i++) {
        const angle = (i * 2 * Math.PI) / intelligenceNames.length - Math.PI / 2
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX + Math.cos(angle) * maxRadius, centerY + Math.sin(angle) * maxRadius)
        ctx.stroke()
      }

      // 绘制数据区域
      ctx.fillStyle = 'rgba(54, 162, 235, 0.3)'
      ctx.strokeStyle = 'rgba(54, 162, 235, 1)'
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let i = 0; i < intelligenceNames.length; i++) {
        const angle = (i * 2 * Math.PI) / intelligenceNames.length - Math.PI / 2
        const score = scores[i]
        const radius = (maxRadius * score) / maxScore
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // 绘制数据点
      ctx.fillStyle = 'rgba(54, 162, 235, 1)'
      for (let i = 0; i < intelligenceNames.length; i++) {
        const angle = (i * 2 * Math.PI) / intelligenceNames.length - Math.PI / 2
        const score = scores[i]
        const radius = (maxRadius * score) / maxScore
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()
      }

      // 绘制标签
      ctx.fillStyle = '#333'
      ctx.font = '14px Arial'
      ctx.textAlign = 'center'
      for (let i = 0; i < intelligenceNames.length; i++) {
        const angle = (i * 2 * Math.PI) / intelligenceNames.length - Math.PI / 2
        const labelRadius = maxRadius + 30
        const x = centerX + Math.cos(angle) * labelRadius
        const y = centerY + Math.sin(angle) * labelRadius

        // 调整文本对齐方式
        if (Math.cos(angle) > 0.1) {
          ctx.textAlign = 'left'
        } else if (Math.cos(angle) < -0.1) {
          ctx.textAlign = 'right'
        } else {
          ctx.textAlign = 'center'
        }

        ctx.fillText(intelligenceNames[i], x, y + 5)

        // 绘制分数
        ctx.font = '12px Arial'
        ctx.fillStyle = '#666'
        ctx.fillText(scores[i].toFixed(1), x, y + 20)
      }

      // 绘制标题
      ctx.fillStyle = '#333'
      ctx.font = 'bold 18px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`${studentName || '学生'}多元智能雷达图`, centerX, 30)

      const imageData = canvas.toDataURL('image/png')
      resolve(imageData)
    } catch (error) {
      reject(error)
    }
  })
}

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

// 导出单个学生报告
export async function exportStudentReport(
  student: StudentData,
  addLog: (message: string) => void
): Promise<void> {
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
    const strategyEvaluation = generateEvaluation([...strengths, ...weaknesses], '提升策略')

    // 创建Word文档
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // 标题
            new Paragraph({
              text: '宝安中学（集团）实验学校 2024 至 2025 学年度第二学期小学部',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),
            new Paragraph({
              text: '一年级指向多元智能发展的个性化综合测评报告',
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),

            // 雷达图
            new Paragraph({
              children: [
                new ImageRun({
                  data: bytes,
                  transformation: {
                    width: 450,
                    height: 450
                  },
                  type: 'png'
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),

            // 评价表格
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE
              },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1 },
                bottom: { style: BorderStyle.SINGLE, size: 1 },
                left: { style: BorderStyle.SINGLE, size: 1 },
                right: { style: BorderStyle.SINGLE, size: 1 },
                insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                insideVertical: { style: BorderStyle.SINGLE, size: 1 }
              },
              rows: [
                // 班级和姓名行
                new TableRow({
                  height: { value: 800, rule: 'atLeast' },
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: '班级', bold: true, size: 24 })],
                          alignment: AlignmentType.CENTER
                        })
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: { size: 20, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: student.班级, size: 24 })],
                          alignment: AlignmentType.CENTER
                        })
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: { size: 30, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: '姓名', bold: true, size: 24 })],
                          alignment: AlignmentType.CENTER
                        })
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: { size: 20, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: student.姓名, bold: true, size: 24 })],
                          alignment: AlignmentType.CENTER
                        })
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: { size: 30, type: WidthType.PERCENTAGE }
                    })
                  ]
                }),

                // 优势智能行
                new TableRow({
                  height: { value: 1200, rule: 'atLeast' },
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: '优势智能', bold: true, size: 24 })],
                          alignment: AlignmentType.CENTER
                        })
                      ],
                      verticalAlign: VerticalAlign.CENTER
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: strengthEvaluation, size: 22 })],
                          alignment: AlignmentType.JUSTIFIED,
                          spacing: { line: 360 }
                        })
                      ],
                      columnSpan: 3,
                      verticalAlign: VerticalAlign.CENTER
                    })
                  ]
                }),

                // 弱势智能行
                new TableRow({
                  height: { value: 1200, rule: 'atLeast' },
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: '弱势智能', bold: true, size: 24 })],
                          alignment: AlignmentType.CENTER
                        })
                      ],
                      verticalAlign: VerticalAlign.CENTER
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: weaknessEvaluation, size: 22 })],
                          alignment: AlignmentType.JUSTIFIED,
                          spacing: { line: 360 }
                        })
                      ],
                      columnSpan: 3,
                      verticalAlign: VerticalAlign.CENTER
                    })
                  ]
                }),

                // 提升策略行
                new TableRow({
                  height: { value: 2400, rule: 'atLeast' },
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: '提升策略', bold: true, size: 24 })],
                          alignment: AlignmentType.CENTER
                        })
                      ],
                      verticalAlign: VerticalAlign.CENTER
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: strategyEvaluation, size: 22 })],
                          alignment: AlignmentType.JUSTIFIED,
                          spacing: { line: 360 }
                        })
                      ],
                      columnSpan: 3,
                      verticalAlign: VerticalAlign.CENTER
                    })
                  ]
                })
              ]
            })
          ]
        }
      ]
    })

    // 导出文档
    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${student.班级}-${student.姓名}-多元智能测评报告.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    addLog(`${student.姓名} 的测评报告生成完成并下载`)
  } catch (error) {
    addLog(`${student.姓名} 的测评报告生成失败: ${error}`)
    throw error
  }
}

// 批量导出所有学生报告
export async function batchExportReports(
  students: StudentData[],
  addLog: (message: string) => void,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  addLog(`开始批量导出 ${students.length} 名学生的测评报告...`)

  for (let i = 0; i < students.length; i++) {
    const student = students[i]
    try {
      await exportStudentReport(student, addLog)
      onProgress?.(i + 1, students.length)

      // 添加延迟避免浏览器冻结
      if (i < students.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    } catch (error) {
      addLog(`跳过 ${student.姓名}，继续处理下一个学生: ${error}`)
      onProgress?.(i + 1, students.length)
    }
  }

  addLog(`批量导出完成！`)
}
