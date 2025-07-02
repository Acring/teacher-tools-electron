import * as XLSX from 'xlsx'

export const generateSampleData = () => {
  // 创建示例数据，符合用户提供的格式
  const sampleData = [
    // 第一行：表格标题
    [
      '宝安中学（集团）实验学校2024——2025学年度第二学期小学部一年级指向多元智能发展的个性化综合测评表'
    ],

    // 第二行：主表头
    [
      '班级',
      '姓名',
      '语言智能——语文、英语',
      null,
      null,
      null,
      null,
      null,
      '语言综合分',
      '数学（逻辑数理智能）',
      null,
      null,
      '数理综合分',
      '科学',
      '体育',
      '科创、美术(视觉空间智能）',
      null,
      '综合分',
      '音乐',
      '劳动',
      null,
      '劳动综合分'
    ],

    // 第三行：子表头
    [
      null,
      null,
      '字词小火车',
      '句子魔法师',
      '课文金话筒',
      'Spelling Bee',
      'Super Reader',
      'Super Talker',
      null,
      '口算达人',
      '图形达人',
      '拼读达人',
      null,
      "'猜分'乐园",
      '跳绳达人',
      '搭建大比拼',
      '夏日果园',
      null,
      "'音'你精彩",
      '红领巾我会系',
      '小书包巧整理',
      null
    ],

    // 学生数据（示例）
    ['一年级1班', '张小明', 5, 5, 4, 5, 5, 4, 5, 5, 5, 5, 5, 4, 4, 5, 5, 5, 4, 5, 5, 5],
    ['一年级1班', '李小红', 4, 4, 5, 4, 5, 4, 4, 5, 4, 4, 5, 5, 4, 4, 5, 4, 5, 4, 5, 5],
    ['一年级1班', '王小华', 5, 5, 5, 5, 4, 5, 5, 4, 5, 5, 5, 4, 5, 5, 4, 5, 4, 5, 4, 4],
    ['一年级1班', '赵小强', 4, 4, 4, 4, 5, 4, 4, 5, 4, 5, 5, 5, 5, 4, 5, 4, 4, 5, 4, 5],
    ['一年级1班', '陈小美', 5, 5, 5, 5, 4, 5, 5, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5, 4, 5, 5],

    ['一年级2班', '刘小刚', 5, 4, 4, 5, 5, 4, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 4, 4, 4, 4],
    ['一年级2班', '周小丽', 4, 5, 4, 4, 4, 5, 4, 4, 4, 4, 4, 5, 4, 5, 4, 4, 5, 5, 5, 5],
    ['一年级2班', '吴小军', 5, 4, 5, 5, 4, 4, 5, 5, 5, 4, 5, 4, 4, 4, 5, 5, 4, 4, 5, 5],
    ['一年级2班', '孙小芳', 4, 5, 4, 5, 5, 5, 5, 5, 4, 5, 4, 5, 5, 4, 5, 5, 5, 5, 4, 4],
    ['一年级2班', '郑小伟', 4, 4, 5, 4, 5, 4, 4, 4, 5, 4, 5, 4, 4, 5, 4, 4, 4, 4, 5, 4],

    ['一年级3班', '马小玲', 5, 5, 4, 5, 4, 5, 5, 5, 4, 5, 5, 5, 5, 4, 5, 5, 4, 5, 4, 5],
    ['一年级3班', '朱小东', 4, 4, 5, 4, 5, 4, 4, 4, 5, 4, 4, 5, 4, 5, 4, 5, 5, 4, 5, 5],
    ['一年级3班', '徐小雨', 5, 5, 4, 5, 4, 5, 4, 5, 4, 5, 5, 4, 4, 5, 5, 5, 4, 5, 4, 5],
    ['一年级3班', '袁小峰', 5, 4, 5, 4, 5, 4, 4, 4, 5, 4, 4, 4, 5, 4, 4, 4, 4, 4, 5, 4],
    ['一年级3班', '胡小慧', 4, 5, 5, 4, 4, 5, 5, 5, 4, 5, 5, 5, 4, 4, 4, 4, 5, 4, 4, 4]
  ]

  return sampleData
}

export const downloadSampleFile = () => {
  try {
    const sampleData = generateSampleData()

    // 创建工作簿
    const workbook = XLSX.utils.book_new()

    // 创建工作表
    const worksheet = XLSX.utils.aoa_to_sheet(sampleData)

    // 合并单元格（标题行）
    if (!worksheet['!merges']) worksheet['!merges'] = []
    worksheet['!merges'].push({
      s: { r: 0, c: 0 }, // 开始位置 (row, col)
      e: { r: 0, c: 20 } // 结束位置 (row, col)
    })

    // 设置列宽
    if (!worksheet['!cols']) worksheet['!cols'] = []
    worksheet['!cols'] = [
      { wch: 12 }, // 班级
      { wch: 10 }, // 姓名
      { wch: 12 }, // 字词小火车
      { wch: 12 }, // 句子魔法师
      { wch: 12 }, // 课文金话筒
      { wch: 12 }, // Spelling Bee
      { wch: 12 }, // Super Reader
      { wch: 12 }, // Super Talker
      { wch: 12 }, // 语言综合分
      { wch: 12 }, // 口算达人
      { wch: 12 }, // 图形达人
      { wch: 12 }, // 拼读达人
      { wch: 12 }, // 数理综合分
      { wch: 12 }, // "猜分"乐园
      { wch: 12 }, // 跳绳达人
      { wch: 12 }, // 搭建大比拼
      { wch: 12 }, // 夏日果园
      { wch: 12 }, // 综合分
      { wch: 12 }, // "音"你精彩
      { wch: 12 }, // 红领巾我会系
      { wch: 12 }, // 小书包巧整理
      { wch: 12 } // 劳动综合分
    ]

    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, '多元智能测评表')

    // 生成文件并下载
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `多元智能测评示例数据-${Date.now()}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    return true
  } catch (error) {
    console.error('生成示例文件失败:', error)
    return false
  }
}
