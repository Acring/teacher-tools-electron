import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Student } from '@renderer/type/student'

export default function StudentPickerPage() {
  // 学生数据相关状态
  const [students, setStudents] = useState<Student[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 抽奖相关状态
  const [isRolling, setIsRolling] = useState(false)
  const [winner, setWinner] = useState<Student | null>(null)
  const [rollingIndex, setRollingIndex] = useState<number>(-1)
  const [avoidRepeat, setAvoidRepeat] = useState(true)
  const [availableStudents, setAvailableStudents] = useState<Student[]>([])
  const rollingTimer = useRef<NodeJS.Timeout | null>(null)

  // 新增：用于存储被勾选的学生id
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
  // 新增：抽取历史
  const [history, setHistory] = useState<{ student: Student; time: number }[]>([])

  // 初始化学生数据和可抽取学生
  useEffect(() => {
    const savedStudents = localStorage.getItem('students')
    if (savedStudents) {
      try {
        const parsed = JSON.parse(savedStudents)
        setStudents(parsed)
        setSelectedStudentIds(parsed.map((s: Student) => s.id)) // 默认全选
        setAvailableStudents(parsed)
      } catch (error) {
        console.error('Error parsing students data:', error)
      }
    }
    // 初始化历史
    const savedHistory = localStorage.getItem('pickerHistory')
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error('Error parsing pickerHistory:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // 监听 selectedStudentIds 变化，更新 availableStudents
  useEffect(() => {
    let filtered = students.filter((s) => selectedStudentIds.includes(s.id))
    // 如果避免重复抽取，过滤掉历史中奖学生
    if (avoidRepeat) {
      const pickedIds = history.map((h) => h.student.id)
      filtered = filtered.filter((s) => !pickedIds.includes(s.id))
    }
    setAvailableStudents(filtered)
  }, [selectedStudentIds, students, avoidRepeat, history])

  // 勾选/取消单个学生
  const handleStudentCheckboxChange = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    )
  }

  // 全选/全不选
  const handleSelectAll = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([])
    } else {
      setSelectedStudentIds(students.map((s) => s.id))
    }
  }

  // 开始抽奖动画
  const handleStart = () => {
    if (isRolling || availableStudents.length === 0) return
    // 兜底：如果避免重复抽取，过滤掉历史中奖学生
    let filteredAvailable = availableStudents
    if (avoidRepeat) {
      const pickedIds = history.map((h) => h.student.id)
      filteredAvailable = availableStudents.filter((s) => !pickedIds.includes(s.id))
      if (filteredAvailable.length === 0) return
      setAvailableStudents(filteredAvailable)
    }
    setIsRolling(true)
    setWinner(null)
    rollingTimer.current = setInterval(() => {
      setRollingIndex((prev) => {
        const next =
          (prev + 1) % (avoidRepeat ? filteredAvailable.length : availableStudents.length)
        return next
      })
    }, 60)
  }

  // 停止抽奖，确定中奖学生
  const handleStop = () => {
    if (!isRolling) return
    setIsRolling(false)
    if (rollingTimer.current) {
      clearInterval(rollingTimer.current)
      rollingTimer.current = null
    }
    // 随机选一个当前高亮的学生
    const idx =
      rollingIndex >= 0 ? rollingIndex : Math.floor(Math.random() * availableStudents.length)
    const selected = availableStudents[idx]
    setWinner(selected)
    // 避免重复抽取
    if (avoidRepeat) {
      setAvailableStudents((prev) => prev.filter((s) => s.id !== selected.id))
    }
    // 记录历史
    if (selected) {
      setHistory((prev) => [{ student: selected, time: Date.now() }, ...prev])
    }
  }

  // 切换避免重复抽取
  const handleAvoidRepeatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvoidRepeat(e.target.checked)
  }

  // 刷新学生数据
  const handleRefresh = () => {
    const savedStudents = localStorage.getItem('students')
    if (savedStudents) {
      try {
        const parsed = JSON.parse(savedStudents)
        setStudents(parsed)
        setSelectedStudentIds(parsed.map((s: Student) => s.id)) // 刷新时全选
        setAvailableStudents(parsed)
      } catch (error) {
        console.error('Error parsing students data:', error)
      }
    }
    setWinner(null)
    setRollingIndex(-1)
    setIsRolling(false)
    if (rollingTimer.current) {
      clearInterval(rollingTimer.current)
      rollingTimer.current = null
    }
  }

  // 重置抽取记录
  const handleReset = () => {
    setAvailableStudents(students)
    setSelectedStudentIds(students.map((s) => s.id)) // 重置时全选
    setWinner(null)
    setRollingIndex(-1)
    setIsRolling(false)
    setHistory([]) // 重置历史
    if (rollingTimer.current) {
      clearInterval(rollingTimer.current)
      rollingTimer.current = null
    }
  }

  // 持久化历史
  useEffect(() => {
    localStorage.setItem('pickerHistory', JSON.stringify(history))
  }, [history])

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (rollingTimer.current) {
        clearInterval(rollingTimer.current)
      }
    }
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-4">
          <span className="text-3xl">🎯</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">学生抽奖器</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          随机选择学生进行课堂提问或抽奖活动，让课堂互动更有趣
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Panel - Settings & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Student Data Source */}

          {/* 参与学生列表 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="text-xl mr-2">📋</span>
                参与学生 ({students.length})
              </h2>
              <button
                className="text-sm px-3 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
                onClick={handleSelectAll}
              >
                {selectedStudentIds.length === students.length ? '全不选' : '全选'}
              </button>
            </div>
            {isLoaded && students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">👥</div>
                <p>请先到学生管理页面添加学生信息</p>
                <p className="text-sm mb-4">完成后回到此页面即可看到学生列表</p>
                <Link
                  to="/students"
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors"
                >
                  前往学生管理
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                {students.map((stu) => (
                  <li
                    key={stu.id}
                    className={`py-2 flex justify-between items-center ${winner?.id === stu.id ? 'bg-yellow-100 font-bold' : ''}`}
                  >
                    <div>
                      <span className="text-lg mr-3">👤</span>
                      <span className="font-medium text-gray-800">{stu.name}</span>
                      {winner?.id === stu.id && <span className="ml-2 text-yellow-600">🏆</span>}
                    </div>
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedStudentIds.includes(stu.id)}
                      onChange={() => handleStudentCheckboxChange(stu.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-xl mr-2">⚙️</span>
              抽奖设置
            </h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={avoidRepeat}
                    onChange={handleAvoidRepeatChange}
                  />
                  <span className="text-sm text-gray-700">避免重复抽取</span>
                </label>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-xl mr-2">🚀</span>
              快速操作
            </h2>
            <div className="space-y-2">
              <button
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                onClick={handleRefresh}
              >
                🔄 刷新学生数据
              </button>
              <button
                className="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                onClick={handleReset}
              >
                🔄 重置抽取记录
              </button>
              <button
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                disabled
              >
                📊 查看抽取统计
              </button>
            </div>
          </div>
        </div>

        {/* Center Panel - Main Picker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Picker Display */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              {/* Picker Display Area */}
              <div className="mb-8">
                <div className="w-60 h-60 mx-auto bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center border-4 border-green-200 shadow-lg">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎯</div>
                    <div className="text-2xl font-bold text-gray-700 mb-2 min-h-[2.5rem] flex items-center justify-center">
                      {isRolling
                        ? availableStudents.length > 0 && rollingIndex >= 0
                          ? availableStudents[rollingIndex]?.name
                          : '抽奖中...'
                        : winner
                          ? winner.name
                          : '准备开始'}
                    </div>
                    <div className="text-gray-500">
                      {winner
                        ? '恭喜中奖！'
                        : availableStudents.length === 0
                          ? '没有可抽取的学生'
                          : '点击开始抽奖'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  className={`px-8 py-3 ${isRolling || availableStudents.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'} text-lg font-semibold rounded-lg`}
                  onClick={handleStart}
                  disabled={isRolling || availableStudents.length === 0}
                >
                  🎯 开始抽奖
                </button>
                <button
                  className={`px-6 py-3 ${!isRolling ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'} rounded-lg`}
                  onClick={handleStop}
                  disabled={!isRolling}
                >
                  ⏹️ 停止
                </button>
              </div>

              {/* Winner Display */}
              <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">🏆 当前选中</h3>
                <div className="text-center py-4 text-gray-700">
                  <div className="text-3xl mb-2">{winner ? '👤' : '👤'}</div>
                  <p>{winner ? winner.name : '还没有进行抽奖'}</p>
                  {!winner && <p className="text-sm">请点击开始抽奖</p>}
                </div>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-xl mr-2">🗓️</span>
              抽取历史
            </h2>
            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-3xl mb-2">📊</div>
                <p>还没有抽取记录</p>
                <p className="text-sm">开始抽奖后，这里会显示历史记录</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                {history.map((item, idx) => (
                  <li key={idx} className="py-2 flex justify-between items-center">
                    <div>
                      <span className="text-lg mr-3">👤</span>
                      <span className="font-medium text-gray-800">{item.student.name}</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                      {new Date(item.time).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
