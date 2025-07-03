import { INTELLIGENCE_MAPPING } from '../templates/evaluation-templates'

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
