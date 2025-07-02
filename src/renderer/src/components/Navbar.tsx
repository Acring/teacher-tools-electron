import { Link, useLocation } from 'react-router-dom'
import UpdateChecker from './UpdateChecker'

export default function Navbar() {
  const location = useLocation()
  const pathname = location.pathname

  const navItems = [
    { href: '/', label: '首页', icon: '🏠' },
    { href: '/students', label: '学生管理', icon: '👥' },
    { href: '/comment-generator', label: '期末评语生成', icon: '✍️' },
    { href: '/student-picker', label: '学生抽奖', icon: '🎯' },
    { href: '/multiple-intelligence', label: '多元智能测评', icon: '🧠' }
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-bold text-gray-900">教师工具箱</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Update Checker */}
          <div className="hidden md:block">
            <UpdateChecker />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
