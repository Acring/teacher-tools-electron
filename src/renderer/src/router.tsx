import { createHashRouter } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './app/page'
import StudentsPage from './app/students/page'
import StudentPickerPage from './app/student-picker/page'
import CommentGeneratorPage from './app/comment-generator/page'
import DocxTestPage from './app/docx-test/page'

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
        path: 'docx-test',
        element: <DocxTestPage />
      }
    ]
  }
])
