import { Outlet } from 'react-router-dom'
import '../assets/main.css'
import Navbar from './Navbar'

export default function Layout(): React.JSX.Element {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
