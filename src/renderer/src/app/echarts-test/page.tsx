import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'

export default function EchartsTestPage() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'scatter' | 'radar'>('line')

  // 示例数据
  const lineData = {
    title: { text: '折线图示例' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['销量', '利润'] },
    xAxis: {
      type: 'category',
      data: ['一月', '二月', '三月', '四月', '五月', '六月']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '销量',
        type: 'line',
        data: [820, 932, 901, 934, 1290, 1330]
      },
      {
        name: '利润',
        type: 'line',
        data: [120, 232, 201, 234, 490, 530]
      }
    ]
  }

  const barData = {
    title: { text: '柱状图示例' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '数据',
        type: 'bar',
        data: [120, 200, 150, 80, 70, 110, 130],
        itemStyle: {
          color: '#3b82f6'
        }
      }
    ]
  }

  const pieData = {
    title: { text: '饼图示例', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '搜索引擎' },
          { value: 735, name: '直接访问' },
          { value: 580, name: '邮件营销' },
          { value: 484, name: '联盟广告' },
          { value: 300, name: '视频广告' }
        ]
      }
    ]
  }

  const scatterData = {
    title: { text: '散点图示例' },
    xAxis: { type: 'value' },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'scatter',
        data: [
          [10.0, 8.04],
          [8.07, 6.95],
          [13.0, 7.58],
          [9.05, 8.81],
          [11.0, 8.33],
          [14.0, 7.66],
          [13.4, 6.81],
          [10.0, 6.33],
          [14.0, 8.96],
          [12.5, 6.82],
          [9.15, 7.2],
          [11.5, 7.2],
          [3.03, 4.23],
          [12.2, 7.83],
          [2.02, 4.47],
          [1.05, 3.33],
          [4.05, 4.96],
          [6.03, 7.24],
          [12.0, 6.26],
          [12.0, 8.84]
        ]
      }
    ]
  }

  const radarData = {
    title: { text: '雷达图示例' },
    radar: {
      indicator: [
        { name: '销售', max: 6500 },
        { name: '管理', max: 16000 },
        { name: '信息技术', max: 30000 },
        { name: '客户支持', max: 38000 },
        { name: '研发', max: 52000 },
        { name: '市场营销', max: 25000 }
      ]
    },
    series: [
      {
        name: '预算 vs 支出',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: '预算分配'
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: '实际支出'
          }
        ]
      }
    ]
  }

  const getChartOptions = () => {
    switch (chartType) {
      case 'line':
        return lineData
      case 'bar':
        return barData
      case 'pie':
        return pieData
      case 'scatter':
        return scatterData
      case 'radar':
        return radarData
      default:
        return lineData
    }
  }

  useEffect(() => {
    if (chartRef.current) {
      // 初始化图表
      chartInstance.current = echarts.init(chartRef.current)

      // 设置图表配置
      chartInstance.current.setOption(getChartOptions())

      // 监听窗口大小变化
      const handleResize = () => {
        chartInstance.current?.resize()
      }
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        chartInstance.current?.dispose()
      }
    }
    return () => {}
  }, [])

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.setOption(getChartOptions(), true)
    }
  }, [chartType])

  const downloadChart = (format: 'png' | 'jpeg' | 'svg') => {
    if (!chartInstance.current) return

    const url = chartInstance.current.getDataURL({
      type: format,
      pixelRatio: 2,
      backgroundColor: '#fff'
    })

    const link = document.createElement('a')
    link.href = url
    link.download = `chart-${chartType}-${Date.now()}.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">ECharts 测试页面</h1>
        <p className="text-gray-600 mb-4">
          这是一个 ECharts 图表测试页面，支持多种图表类型的展示和下载。
        </p>
      </div>

      {/* 图表类型选择器 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">选择图表类型：</label>
        <div className="flex gap-2 flex-wrap">
          {(['line', 'bar', 'pie', 'scatter', 'radar'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-4 py-2 rounded transition-colors ${
                chartType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type === 'line' && '折线图'}
              {type === 'bar' && '柱状图'}
              {type === 'pie' && '饼图'}
              {type === 'scatter' && '散点图'}
              {type === 'radar' && '雷达图'}
            </button>
          ))}
        </div>
      </div>

      {/* 下载按钮 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">下载图表：</label>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => downloadChart('png')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            下载 PNG
          </button>
          <button
            onClick={() => downloadChart('jpeg')}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            下载 JPG
          </button>
          <button
            onClick={() => downloadChart('svg')}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            下载 SVG
          </button>
        </div>
      </div>

      {/* 图表容器 */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div ref={chartRef} className="w-full" style={{ height: '500px' }} />
      </div>

      {/* 使用说明 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">使用说明</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          <li>点击上方按钮可以切换不同类型的图表</li>
          <li>图表支持鼠标交互，可以查看详细数据</li>
          <li>点击下载按钮可以将图表保存为 PNG、JPG 或 SVG 格式</li>
          <li>图表会自适应窗口大小变化</li>
        </ul>
      </div>
    </div>
  )
}
