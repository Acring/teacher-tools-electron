import { createHashRouter } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './app/page'
import StudentsPage from './app/students/page'
import StudentPickerPage from './app/student-picker/page'
import CommentGeneratorPage from './app/comment-generator/page'
import DocxTestPage from './app/docx-test/page'
import EchartsTestPage from './app/echarts-test/page'
import XlsxTestPage from './app/xlsx-test/page'
import MultipleIntelligencePage from './app/multiple-intelligence/page'
import MorePage from './app/more/page'

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'students',
        element: <StudentsPage />
      },
      {
        path: 'student-picker',
        element: <StudentPickerPage />
      },
      {
        path: 'comment-generator',
        element: <CommentGeneratorPage />
      },
      {
        path: 'more',
        element: <MorePage />
      },
      {
        path: 'multiple-intelligence',
        element: <MultipleIntelligencePage />
      },
      {
        path: 'xlsx-test',
        element: <XlsxTestPage />
      },
      {
        path: 'echarts-test',
        element: <EchartsTestPage />
      },
      {
        path: 'docx-test',
        element: <DocxTestPage />
      }
    ]
  }
])
