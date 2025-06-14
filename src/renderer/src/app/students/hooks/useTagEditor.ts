import { useState } from 'react'
import { Student, EvaluationTags } from '../../../type/student'
import { EXCLUSIVE_TAG_GROUPS } from '../../../constants/evaluation-tags'

export function useTagEditor(students: Student[] = []) {
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [showTagEditor, setShowTagEditor] = useState(false)
  const [editingTags, setEditingTags] = useState<EvaluationTags | null>(null)

  // 检查标签是否与已选标签互斥
  const isTagExclusive = (tag: string, currentTags: string[]): boolean => {
    for (const group of EXCLUSIVE_TAG_GROUPS) {
      if (group.includes(tag)) {
        // 检查是否有其他同组标签已被选择
        return currentTags.some((selectedTag) => group.includes(selectedTag) && selectedTag !== tag)
      }
    }
    return false
  }

  // 打开标签编辑器
  const openTagEditor = (student: Student) => {
    setEditingStudent(student)
    // 初始化本地编辑状态，复制当前学生的标签
    setEditingTags(
      student.evaluationTags || {
        characteristics: [],
        discipline: [],
        academic: [],
        homework: [],
        physicalLabor: []
      }
    )
    setShowTagEditor(true)
  }

  // 获取下一个学生
  const findNextStudent = (currentStudent: Student): Student | null => {
    const currentIndex = students.findIndex((s) => s.id === currentStudent.id)
    if (currentIndex >= 0 && currentIndex < students.length - 1) {
      return students[currentIndex + 1]
    }
    return null
  }

  // 检查是否有下一个学生
  const hasNextStudent = (currentStudent: Student | null): boolean => {
    if (!currentStudent) return false
    return findNextStudent(currentStudent) !== null
  }

  // 打开下一个学生的标签编辑器
  const openNextStudent = (currentStudent: Student) => {
    const nextStudent = findNextStudent(currentStudent)
    if (nextStudent) {
      openTagEditor(nextStudent)
    }
  }

  // 关闭标签编辑器
  const closeTagEditor = () => {
    setEditingStudent(null)
    setEditingTags(null)
    setShowTagEditor(false)
  }

  // 切换标签选择状态
  const toggleTag = (category: keyof EvaluationTags, tag: string) => {
    if (!editingTags) return

    const currentTags = { ...editingTags }
    const categoryTags = currentTags[category]
    const isSelected = categoryTags.includes(tag)

    if (isSelected) {
      // 取消选择
      currentTags[category] = categoryTags.filter((t) => t !== tag)
    } else {
      // 检查是否与已选标签互斥
      const allCurrentTags = [
        ...currentTags.characteristics,
        ...currentTags.discipline,
        ...currentTags.academic,
        ...currentTags.homework,
        ...currentTags.physicalLabor
      ]

      if (isTagExclusive(tag, allCurrentTags)) {
        alert('该标签与已选择的标签冲突，请先取消冲突的标签')
        return
      }

      // 添加标签
      currentTags[category] = [...categoryTags, tag]
    }

    setEditingTags(currentTags)
  }

  return {
    editingStudent,
    showTagEditor,
    editingTags,
    openTagEditor,
    closeTagEditor,
    toggleTag,
    findNextStudent,
    hasNextStudent,
    openNextStudent
  }
}
