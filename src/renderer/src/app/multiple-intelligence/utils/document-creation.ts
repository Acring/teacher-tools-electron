import { StudentData } from '../types'
import {
  Document,
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

// 创建Word文档
export function createReportDocument(
  student: StudentData,
  imageData: Uint8Array,
  strengthEvaluation: string,
  weaknessEvaluation: string,
  strategyEvaluation: string,
  mainTitle: string,
  subTitle: string
): Document {
  return new Document({
    sections: [
      {
        properties: {},
        children: [
          // 标题
          new Paragraph({
            children: [
              new TextRun({
                text: mainTitle,
                bold: true,
                font: '仿宋',
                size: 36,
                color: '000000'
              })
            ],
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: subTitle,
                bold: true,
                font: '仿宋',
                size: 32,
                color: '000000'
              })
            ],
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          // 雷达图
          new Paragraph({
            children: [
              new ImageRun({
                data: imageData,
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
}
