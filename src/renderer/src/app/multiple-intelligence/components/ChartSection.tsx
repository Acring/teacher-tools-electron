import { useRef, useEffect } from 'react'
import * as echarts from 'echarts'
import { StatisticsData, ChartType } from '../types'
import { INTELLIGENCE_MAPPING } from '../templates/evaluation-templates'

interface ChartSectionProps {
  statistics: StatisticsData[]
  activeChart: ChartType
  setActiveChart: (chartType: ChartType) => void
  addLog: (message: string) => void
}

export default function ChartSection({
  statistics,
  activeChart,
  setActiveChart,
  addLog
}: ChartSectionProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  // 计算智能分组的平均分
  const calculateIntelligenceGroupAverages = () => {
    const groupAverages: Record<string, number> = {}
    const groupCounts: Record<string, number> = {}

    // 初始化分组
    Object.keys(INTELLIGENCE_MAPPING).forEach((key) => {
      groupAverages[key] = 0
      groupCounts[key] = 0
    })

    // 计算每个分组的总分和项目数
    statistics.forEach((stat) => {
      for (const [group, subjects] of Object.entries(INTELLIGENCE_MAPPING)) {
        if (subjects.includes(stat.subjectName)) {
          groupAverages[group] += stat.average
          groupCounts[group] += 1
          break
        }
      }
    })

    // 计算每个分组的平均分
    Object.keys(groupAverages).forEach((group) => {
      if (groupCounts[group] > 0) {
        groupAverages[group] = +(groupAverages[group] / groupCounts[group]).toFixed(2)
      }
    })

    return groupAverages
  }

  // 生成图表配置
  const generateChartOption = (): echarts.EChartsOption => {
    switch (activeChart) {
      case 'overview':
        return {
          title: { text: '多元智能测评概览', left: 'center', top: '2%' },
          tooltip: { trigger: 'axis' },
          legend: {
            data: ['平均分', '最高分', '最低分'],
            top: '8%',
            left: 'center'
          },
          grid: {
            top: '18%',
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: statistics.map((stat) => stat.subjectName),
            axisLabel: { rotate: 45, interval: 0 }
          },
          yAxis: { type: 'value', name: '分数' },
          series: [
            {
              name: '平均分',
              type: 'bar',
              data: statistics.map((stat) => stat.average),
              itemStyle: { color: '#3b82f6' }
            },
            {
              name: '最高分',
              type: 'line',
              data: statistics.map((stat) => stat.max),
              itemStyle: { color: '#ef4444' }
            },
            {
              name: '最低分',
              type: 'line',
              data: statistics.map((stat) => stat.min),
              itemStyle: { color: '#22c55e' }
            }
          ]
        }

      case 'average':
        return {
          title: { text: '各项智能平均分对比', left: 'center', top: '2%' },
          tooltip: { trigger: 'item' },
          series: [
            {
              name: '平均分',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              data: statistics.map((stat) => ({
                value: stat.average,
                name: stat.subjectName
              })),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }

      case 'ranking': {
        const sortedStats = [...statistics].sort((a, b) => b.average - a.average)
        return {
          title: { text: '智能项目排名（按平均分）', left: 'center', top: '2%' },
          tooltip: { trigger: 'axis' },
          grid: {
            left: '15%',
            top: '10%',
            right: '4%',
            bottom: '8%',
            containLabel: true
          },
          xAxis: { type: 'value', name: '平均分' },
          yAxis: {
            type: 'category',
            data: sortedStats.map((stat) => stat.subjectName)
          },
          series: [
            {
              name: '平均分',
              type: 'bar',
              data: sortedStats.map((stat) => stat.average),
              itemStyle: { color: '#8b5cf6' }
            }
          ]
        }
      }

      case 'radar': {
        const groupAverages = calculateIntelligenceGroupAverages()
        const intelligenceGroups = Object.keys(INTELLIGENCE_MAPPING)
        const data = intelligenceGroups.map((group) => groupAverages[group] || 0)

        return {
          title: {
            text: '多元智能雷达图',
            left: 'center',
            top: '2%'
          },
          tooltip: {},
          legend: {
            data: ['智能分布'],
            bottom: '5%'
          },
          radar: {
            indicator: intelligenceGroups.map((name) => ({
              name,
              max: Math.max(...Object.values(groupAverages)) * 1.2
            })),
            radius: '65%',
            center: ['50%', '55%']
          },
          series: [
            {
              name: '智能分布',
              type: 'radar',
              data: [
                {
                  value: data,
                  name: '智能分布',
                  areaStyle: {
                    color: 'rgba(123, 104, 238, 0.4)'
                  },
                  lineStyle: {
                    color: 'rgb(123, 104, 238)'
                  }
                }
              ]
            }
          ]
        }
      }

      default:
        return {}
    }
  }

  // 更新图表
  const updateChart = () => {
    if (!chartInstance.current || statistics.length === 0) {
      return
    }

    try {
      const option = generateChartOption()
      chartInstance.current.setOption(option, true)
      addLog(`图表更新成功: ${activeChart}`)
    } catch (error) {
      addLog(`图表更新失败: ${error}`)
    }
  }

  // 初始化图表
  const initChart = () => {
    if (!chartRef.current) return

    try {
      // 如果图表已存在，先销毁
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }

      chartInstance.current = echarts.init(chartRef.current)
      addLog('图表初始化成功')

      // 立即更新图表
      if (statistics.length > 0) {
        updateChart()
      }
    } catch (error) {
      addLog(`图表初始化失败: ${error}`)
    }
  }

  // 下载图表
  const downloadChart = () => {
    if (!chartInstance.current) return

    const url = chartInstance.current.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    })

    const link = document.createElement('a')
    link.href = url
    link.download = `多元智能测评-${activeChart}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 监听数据变化，重新初始化图表
  useEffect(() => {
    if (statistics.length > 0) {
      setTimeout(() => {
        initChart()
      }, 200)
    }
  }, [statistics])

  // 监听图表类型变化，更新图表
  useEffect(() => {
    if (chartInstance.current && statistics.length > 0) {
      updateChart()
    }
  }, [activeChart])

  // 组件卸载时清理图表
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize()
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }
    }
  }, [])

  if (statistics.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">统计分析图表</h2>
        <div className="flex gap-2">
          <button
            onClick={downloadChart}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
          >
            📷 保存图表
          </button>
        </div>
      </div>

      {/* 图表类型选择器 */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setActiveChart('overview')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeChart === 'overview'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📊 综合概览
        </button>
        <button
          onClick={() => setActiveChart('average')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeChart === 'average'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🥧 平均分对比
        </button>
        <button
          onClick={() => setActiveChart('ranking')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeChart === 'ranking'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🏆 智能排名
        </button>
        <button
          onClick={() => setActiveChart('radar')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeChart === 'radar'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📡 智能雷达图
        </button>
      </div>

      {/* 图表容器 */}
      <div ref={chartRef} className="w-full" style={{ height: '700px' }} />
    </div>
  )
}
