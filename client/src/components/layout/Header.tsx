import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Sun, Moon, Monitor, Search, X, FileText, BookOpen, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useSearch } from '@/hooks/useData'

function formatSize(bytes: number): string {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

interface HeaderProps {
  onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { data: results } = useSearch(query)

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const goTo = (path: string) => {
    navigate(path)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  const hasResults = results && (results.subjects.length + results.chapters.length + results.files.length > 0)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-950/60 backdrop-blur-xl px-4 lg:px-6">
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden h-8 w-8 p-0 -ml-1 mr-2"
        onClick={onMenuToggle}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search Bar */}
      <div className="relative flex-1 max-w-md" ref={dropdownRef}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search subjects, chapters, files..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          className="w-full pl-10 pr-8 py-1.5 text-sm bg-gray-100 dark:bg-gray-800/60 border border-transparent focus:border-blue-400 dark:focus:border-blue-600 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 outline-none transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus() }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Search Results Dropdown */}
        {open && query.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden max-h-[60vh] overflow-y-auto z-50">
            {!hasResults && (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No results found
              </div>
            )}

            {results?.subjects && results.subjects.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Subjects</div>
                {results.subjects.map((s) => (
                  <button key={s.id} onClick={() => goTo(`/subjects/${s.id}`)} className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <BookOpen className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{s.name}</span>
                  </button>
                ))}
              </div>
            )}

            {results?.chapters && results.chapters.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Chapters</div>
                {results.chapters.map((c) => (
                  <button key={c.id} onClick={() => goTo(`/subjects/${c.subjectId}/chapters/${c.id}`)} className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <Layers className="h-4 w-4 text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate block">{c.name}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{c.subject.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {results?.files && results.files.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Files</div>
                {results.files.map((f) => (
                  <button key={f.id} onClick={() => f.chapterId && goTo(`/subjects/${f.chapter?.subjectId}/chapters/${f.chapterId}`)} className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <FileText className="h-4 w-4 text-violet-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate block">{f.originalName}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{f.chapter?.name} &middot; {formatSize(f.size)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={cycleTheme}
        title={`Theme: ${theme}`}
      >
        {theme === 'light' && <Sun className="h-4 w-4 text-amber-500" />}
        {theme === 'dark' && <Moon className="h-4 w-4 text-blue-400" />}
        {theme === 'system' && <Monitor className="h-4 w-4 text-gray-500" />}
      </Button>
    </header>
  )
}
