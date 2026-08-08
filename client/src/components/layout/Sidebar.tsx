import { LayoutDashboard, Sun, Moon, X, BookOpen, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/layout/ThemeProvider'
import { NavLink } from 'react-router-dom'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { theme, setTheme } = useTheme()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/60 dark:border-gray-800/60 flex flex-col z-50
          transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-5 border-b border-gray-200/60 dark:border-gray-800/60 flex items-center justify-between">
          <NavLink to="/" onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900 dark:text-white leading-none">Knowledge Hub</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Class 10</p>
            </div>
          </NavLink>
          <Button variant="ghost" size="sm" className="lg:hidden h-7 w-7 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>

          <NavLink
            to="/favorites"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <Star className="h-4 w-4" />
            Favorites
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-200/60 dark:border-gray-800/60">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full justify-start gap-2.5 h-9 text-sm text-gray-600 dark:text-gray-400"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4" />
                Light mode
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                Dark mode
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
