import { Outlet } from 'react-router-dom'
import { Suspense, useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { Loader2 } from 'lucide-react'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin mx-auto my-8" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
