import { useState, useEffect } from 'react'
import { Student } from '@renderer/type/student'

export function useStudentData() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 从 localStorage 加载数据
  useEffect(() => {
    const savedStudents = localStorage.getItem('students')
    if (savedStudents) {
      try {
        const parsed = JSON.parse(savedStudents)
        // 为旧数据添加默认的评价标签结构
        const studentsWithTags = parsed.map((student: Student) => ({
          ...student,
          evaluationTags: student.evaluationTags || {
            characteristics: [],
            discipline: [],
            academic: [],
            homework: [],
            physicalLabor: []
          }
        }))
        setStudents(studentsWithTags)
      } catch (error) {
        console.error('Error parsing students data:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // 保存数据到 localStorage（只有在初始加载完成后才保存）
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('students', JSON.stringify(students))
    }
  }, [students, isLoaded])

  // 批量添加学生
  const addBulkStudents = (bulkStudentNames: string) => {
    if (bulkStudentNames.trim()) {
      const names = bulkStudentNames
        .split(/[,，]/)
        .map((name) => name.trim())
        .filter((name) => name.length > 0)

      const newStudents: Student[] = names.map((name) => ({
        id: `${Date.now()}-${Math.random()}`,
        name: name,
        evaluationTags: {
          characteristics: [],
          discipline: [],
          academic: [],
          homework: [],
          physicalLabor: []
        }
      }))

      setStudents((prev) => [...prev, ...newStudents])
    }
  }

  // 删除学生
  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id))
  }

  // 更新学生
  const updateStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)))
  }

  // 清空所有数据
  const clearAllStudents = () => {
    if (confirm('确定要清空所有学生数据吗？此操作不可恢复。')) {
      setStudents([])
    }
  }

  // 批量导入示例数据
  const importSampleData = () => {
    const sampleStudents: Student[] = [
      {
        id: '1',
        name: '张小明',
        evaluationTags: {
          characteristics: [],
          discipline: [],
          academic: [],
          homework: [],
          physicalLabor: []
        }
      },
      {
        id: '2',
        name: '李小红',
        evaluationTags: {
          characteristics: [],
          discipline: [],
          academic: [],
          homework: [],
          physicalLabor: []
        }
      },
      {
        id: '3',
        name: '王小华',
        evaluationTags: {
          characteristics: [],
          discipline: [],
          academic: [],
          homework: [],
          physicalLabor: []
        }
      },
      {
        id: '4',
        name: '刘小强',
        evaluationTags: {
          characteristics: [],
          discipline: [],
          academic: [],
          homework: [],
          physicalLabor: []
        }
      },
      {
        id: '5',
        name: '陈小美',
        evaluationTags: {
          characteristics: [],
          discipline: [],
          academic: [],
          homework: [],
          physicalLabor: []
        }
      },
      {
        id: '6',
        name: '赵小刚',
        evaluationTags: {
          characteristics: [],
          discipline: [],
          academic: [],
          homework: [],
          physicalLabor: []
        }
      },
      {
        id: '7',
        name: '孙小丽',
        evaluationTags: {
          characteristics: [],
          discipline: [],
          academic: [],
          homework: [],
          physicalLabor: []
        }
      },
      {
        id: '8',
        name: '周小勇',
        evaluationTags: {
          characteristics: [],
          discipline: [],
          academic: [],
          homework: [],
          physicalLabor: []
        }
      }
    ]
    setStudents((prev) => [...prev, ...sampleStudents])
  }

  // 导出数据为 JSON 文件
  const exportData = () => {
    const dataStr = JSON.stringify(students, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `students_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // 导入数据从 JSON 文件
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedStudents: Student[] = JSON.parse(content)

        // 验证数据格式
        if (Array.isArray(importedStudents)) {
          const validStudents = importedStudents.filter(
            (student) =>
              student &&
              typeof student.id === 'string' &&
              typeof student.name === 'string' &&
              student.name.trim()
          )

          if (validStudents.length > 0) {
            // 检查是否有重复的学生（基于姓名）
            const existingNames = students.map((s) => s.name.toLowerCase())
            const newStudents = validStudents.filter(
              (student) => !existingNames.includes(student.name.toLowerCase())
            )

            if (newStudents.length === 0) {
              alert('导入的学生都已存在，没有新增学生。')
            } else {
              // 重新生成 ID 避免冲突
              const studentsWithNewIds = newStudents.map((student) => ({
                ...student,
                id: `${Date.now()}-${Math.random()}`,
                evaluationTags: student.evaluationTags || {
                  characteristics: [],
                  discipline: [],
                  academic: [],
                  homework: [],
                  physicalLabor: []
                }
              }))

              setStudents((prev) => [...prev, ...studentsWithNewIds])
              alert(`成功导入 ${newStudents.length} 名学生！`)
            }
          } else {
            alert('导入的文件中没有有效的学生数据。')
          }
        } else {
          alert('文件格式不正确，请选择有效的学生数据文件。')
        }
      } catch (error) {
        console.error('导入数据错误:', error)
        alert('文件格式错误，请选择有效的 JSON 文件。')
      }
    }
    reader.readAsText(file)

    // 清空文件输入
    event.target.value = ''
  }

  return {
    students,
    addBulkStudents,
    deleteStudent,
    updateStudent,
    clearAllStudents,
    importSampleData,
    exportData,
    importData
  }
}
