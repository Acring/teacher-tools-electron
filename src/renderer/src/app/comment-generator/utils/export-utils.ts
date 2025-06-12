import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  FileChild
} from '@acring4ever/docx'
import { Student } from '@renderer/type/student'

export interface CommentData {
  comment: string
  usedTags: string[]
}

// 边框模版类型
export type BorderTemplate =
  | 'none'
  | 'simple'
  | 'double'
  | 'dotted'
  | 'dashed'
  | 'thick'
  | 'decorative'

// 边框配置
export interface BorderConfig {
  template: BorderTemplate
  color?: string
  size?: number
}

export interface ExportConfig {
  commentsPerLine?: number
  fontSize?: number
  fontFamily?: string
  border?: BorderConfig
}

// 边框模版定义
const BORDER_TEMPLATES = {
  none: {
    style: BorderStyle.NONE,
    size: 0,
    color: '000000'
  },
  simple: {
    style: BorderStyle.SINGLE,
    size: 4,
    color: '000000'
  },
  double: {
    style: BorderStyle.DOUBLE,
    size: 6,
    color: '000000'
  },
  dotted: {
    style: BorderStyle.DOTTED,
    size: 4,
    color: '666666'
  },
  dashed: {
    style: BorderStyle.DASHED,
    size: 4,
    color: '666666'
  },
  thick: {
    style: BorderStyle.SINGLE,
    size: 12,
    color: '333333'
  },
  decorative: {
    style: BorderStyle.DOUBLE,
    size: 8,
    color: '0066CC'
  }
}

/**
 * 获取边框样式配置
 */
function getBorderStyle(borderConfig?: BorderConfig) {
  if (!borderConfig || borderConfig.template === 'none') {
    return {
      top: { style: BorderStyle.NONE, size: 0, color: '000000' },
      bottom: { style: BorderStyle.NONE, size: 0, color: '000000' },
      left: { style: BorderStyle.NONE, size: 0, color: '000000' },
      right: { style: BorderStyle.NONE, size: 0, color: '000000' }
    }
  }

  const template = BORDER_TEMPLATES[borderConfig.template]
  const color = borderConfig.color || template.color
  const size = borderConfig.size || template.size

  return {
    top: { style: template.style, size, color },
    bottom: { style: template.style, size, color },
    left: { style: template.style, size, color },
    right: { style: template.style, size, color }
  }
}

/**
 * 导出评语为 DOCX 格式
 */
export async function exportCommentsToDocx(
  comments: { [key: string]: CommentData },
  students: Student[],
  config?: ExportConfig
): Promise<void> {
  try {
    const { commentsPerLine = 1, fontSize = 12, fontFamily, border } = config || {}

    // 创建文档段落
    const children: FileChild[] = []

    // 添加标题
    children.push(
      new Paragraph({
        text: '学生期末评语',
        heading: HeadingLevel.TITLE,
        spacing: {
          after: 400
        },
        alignment: AlignmentType.CENTER
      })
    )

    // 添加日期
    const currentDate = new Date().toLocaleDateString('zh-CN')
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `生成日期：${currentDate}`,
            size: 24,
            color: '666666',
            font: fontFamily
          })
        ],
        spacing: {
          after: 600
        },
        alignment: AlignmentType.CENTER
      })
    )

    // 准备评语数据
    const commentEntries = Object.entries(comments).map(([studentId, commentData]) => {
      const student = students.find((s) => s.id === studentId)
      return {
        studentId,
        studentName: student?.name || '',
        comment: commentData.comment,
        usedTags: commentData.usedTags
      }
    })

    // 获取边框样式
    const borderStyle = getBorderStyle(border)

    if (commentsPerLine === 1) {
      // 单列布局：每个学生用表格包装以支持边框
      commentEntries.forEach((entry) => {
        // 处理评语内容的换行符
        const commentLines = entry.comment.split('\n')
        const commentParagraphs = [
          // 评语内容段落
          ...commentLines.map(
            (line, index) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: fontSize * 2,
                    font: fontFamily
                  })
                ],
                spacing: {
                  after: index === commentLines.length - 1 ? 0 : 100
                },
                // 第一行（学生姓名）不缩进，后续段落首行缩进两个字符
                indent: index === 0 ? { left: 0 } : { left: 0, firstLine: 400 }
              })
          )
        ]

        // 创建包装表格
        const table = new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: commentParagraphs,
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  margins: {
                    top: 300,
                    bottom: 300,
                    left: 300,
                    right: 300
                  },
                  borders: borderStyle
                })
              ]
            })
          ],
          width: { size: 100, type: WidthType.PERCENTAGE },
          margins: { top: 200, bottom: 200 }
        })

        children.push(table)

        // 添加间距
        children.push(
          new Paragraph({
            text: '',
            spacing: { after: 400 }
          })
        )
      })
    } else {
      // 多列布局：使用表格
      for (let i = 0; i < commentEntries.length; i += commentsPerLine) {
        const rowEntries = commentEntries.slice(i, i + commentsPerLine)

        // 创建表格行
        const tableRow = new TableRow({
          children: rowEntries.reduce((acc, entry, index) => {
            // 处理评语内容的换行符
            const commentLines = entry.comment.split('\n')
            const commentParagraphs = [
              // 评语内容
              ...commentLines.map(
                (line, lineIndex) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: line,
                        size: fontSize * 2,
                        font: fontFamily
                      })
                    ],
                    spacing: { after: lineIndex === commentLines.length - 1 ? 0 : 100 },
                    // 第一行（学生姓名）不缩进，后续段落首行缩进两个字符
                    indent: lineIndex === 0 ? {} : { firstLine: 400 }
                  })
              )
            ]

            const commentCell = new TableCell({
              children: commentParagraphs,
              width: {
                size: Math.floor(100 / commentsPerLine),
                type: WidthType.PERCENTAGE
              },
              margins: {
                top: 300,
                bottom: 300,
                left: 200,
                right: 200
              },
              borders: borderStyle
            })

            acc.push(commentCell)

            // 在非最后一个单元格后添加间距单元格
            if (index < rowEntries.length - 1) {
              const spacingCell = new TableCell({
                children: [new Paragraph({ text: '' })],
                width: {
                  size: 2,
                  type: WidthType.PERCENTAGE
                },
                margins: {
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0
                },
                borders: {
                  top: { style: BorderStyle.NONE, size: 0, color: '000000' },
                  bottom: { style: BorderStyle.NONE, size: 0, color: '000000' },
                  left: { style: BorderStyle.NONE, size: 0, color: '000000' },
                  right: { style: BorderStyle.NONE, size: 0, color: '000000' }
                }
              })
              acc.push(spacingCell)
            }

            return acc
          }, [] as TableCell[])
        })

        // 如果行不满，添加空白单元格来填充
        const currentCellCount = rowEntries.length + Math.max(0, rowEntries.length - 1) // 评语单元格 + 间距单元格
        const targetCellCount = commentsPerLine + Math.max(0, commentsPerLine - 1) // 目标单元格数量

        for (let i = currentCellCount; i < targetCellCount; i++) {
          const isEmpty = i >= rowEntries.length * 2 - 1 // 判断是否是空白位置

          if (isEmpty || i % 2 === 1) {
            // 间距单元格或空白单元格
            tableRow.addChildElement(
              new TableCell({
                children: [new Paragraph({ text: '' })],
                width: {
                  size: i % 2 === 1 ? 2 : Math.floor(100 / commentsPerLine),
                  type: WidthType.PERCENTAGE
                },
                margins: {
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0
                },
                borders: {
                  top: { style: BorderStyle.NONE, size: 0, color: '000000' },
                  bottom: { style: BorderStyle.NONE, size: 0, color: '000000' },
                  left: { style: BorderStyle.NONE, size: 0, color: '000000' },
                  right: { style: BorderStyle.NONE, size: 0, color: '000000' }
                }
              })
            )
          }
        }

        // 将行添加到表格中
        const table = new Table({
          rows: [tableRow],
          width: {
            size: 100,
            type: WidthType.PERCENTAGE
          },
          margins: {
            top: 300,
            bottom: 300
          }
        })

        // 在每行评语之间添加更多间距
        children.push(table)

        // 在表格后添加一些间距
        children.push(
          new Paragraph({
            text: '',
            spacing: { after: 600 }
          })
        )
      }
    }

    // 创建文档
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: children
        }
      ]
    })

    // 生成文档并下载
    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `学生评语_${new Date().toISOString().split('T')[0]}.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('导出 DOCX 文档时出错：', error)
    throw new Error('导出文档失败，请重试')
  }
}

/**
 * 导出评语为 TXT 格式（保留原有功能）
 */
export function exportCommentsToTxt(
  comments: { [key: string]: CommentData },
  students: Student[]
): void {
  const commentsText = Object.entries(comments)
    .map(([studentId, commentData]) => {
      const student = students.find((s) => s.id === studentId)
      return `${student?.name}：\n${commentData.comment}\n`
    })
    .join('\n')

  const blob = new Blob([commentsText], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '学生评语.txt'
  a.click()
  URL.revokeObjectURL(url)
}
