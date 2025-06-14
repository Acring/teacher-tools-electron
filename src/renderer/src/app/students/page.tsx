import { useState } from 'react'
import { useStudentData } from './hooks/useStudentData'
import { useTagEditor } from './hooks/useTagEditor'
import PageHeader from './components/PageHeader'
import StatisticsPanel from './components/StatisticsPanel'
import BulkAddStudents from './components/BulkAddStudents'
import BatchOperations from './components/BatchOperations'
import StudentList from './components/StudentList'
import TagEditor from './components/TagEditor'
import UsageTips from './components/UsageTips'
import * as XLSX from 'xlsx'

export default function StudentsPage() {
  const [bulkStudentNames, setBulkStudentNames] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // 使用自定义 hooks
  const {
    students,
    addBulkStudents,
    deleteStudent,
    updateStudent,
    clearAllStudents,
    importSampleData,
    exportData,
    importData
  } = useStudentData()

  const {
    editingStudent,
    showTagEditor,
    editingTags,
    openTagEditor,
    closeTagEditor,
    toggleTag,
    hasNextStudent,
    openNextStudent
  } = useTagEditor(students)

  // 过滤学生列表
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 处理批量添加
  const handleAddBulkStudents = () => {
    addBulkStudents(bulkStudentNames)
    setBulkStudentNames('')
  }

  // 处理标签编辑保存
  const handleSaveTagEdits = () => {
    if (!editingStudent || !editingTags) return

    const updatedStudent = { ...editingStudent, evaluationTags: editingTags }
    updateStudent(updatedStudent)
    closeTagEditor()
  }

  // 处理保存并编辑下一个
  const handleSaveTagEditsAndNext = () => {
    if (!editingStudent || !editingTags) return

    const updatedStudent = { ...editingStudent, evaluationTags: editingTags }
    updateStudent(updatedStudent)
    openNextStudent(editingStudent)
  }

  // 处理 Excel 导入
  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const json: unknown[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      if (!json.length) return

      const headerRow = json[0].map((cell) => ((cell || '') as string).toString().trim())
      // 判断是否有表头
      const nameKeys = ['姓名', '名字', 'name', 'Name']
      const names: string[] = json
        .slice(headerRow.some((cell) => nameKeys.includes(cell)) ? 1 : 0)
        .map((row) => (row[0] || '').toString().trim())
        .filter(Boolean)
      if (names.length) {
        addBulkStudents(names.join(','))
      }
    }
    reader.readAsArrayBuffer(file)
    // 清空 input 以便连续导入
    event.target.value = ''
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Panel - Statistics & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <StatisticsPanel
            totalStudents={students.length}
            filteredStudents={filteredStudents.length}
          />

          <BulkAddStudents
            bulkStudentNames={bulkStudentNames}
            setBulkStudentNames={setBulkStudentNames}
            onAddBulkStudents={handleAddBulkStudents}
          />

          <BatchOperations
            studentCount={students.length}
            onImportSample={importSampleData}
            onExportData={exportData}
            onImportData={(e) => {
              // 判断文件类型
              const file = e.target.files?.[0]
              if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
                handleImportExcel(e)
              } else {
                importData(e)
              }
            }}
            onClearAll={clearAllStudents}
          />
        </div>

        {/* Right Panel - Student List */}
        <div className="lg:col-span-2">
          <StudentList
            students={students}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onEditTags={openTagEditor}
            onDeleteStudent={deleteStudent}
          />
        </div>
      </div>

      <UsageTips />

      {/* Tag Editor Modal */}
      <TagEditor
        isOpen={showTagEditor}
        student={editingStudent}
        editingTags={editingTags}
        onClose={closeTagEditor}
        onSave={handleSaveTagEdits}
        onSaveAndNext={handleSaveTagEditsAndNext}
        onToggleTag={toggleTag}
        hasNextStudent={hasNextStudent(editingStudent)}
      />
    </div>
  )
}
