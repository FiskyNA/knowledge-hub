import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useSubjects } from '@/hooks/useData'

const subjectStyles: Record<string, { bg: string; icon: string; hover: string }> = {
  Mathematics: { bg: 'from-blue-500 to-blue-600', icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', hover: 'hover:border-blue-300 dark:hover:border-blue-600' },
  Science: { bg: 'from-emerald-500 to-emerald-600', icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', hover: 'hover:border-emerald-300 dark:hover:border-emerald-600' },
  English: { bg: 'from-amber-500 to-amber-600', icon: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400', hover: 'hover:border-amber-300 dark:hover:border-amber-600' },
  'Hindi (Course A)': { bg: 'from-red-500 to-red-600', icon: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400', hover: 'hover:border-red-300 dark:hover:border-red-600' },
  'Social Science': { bg: 'from-violet-500 to-violet-600', icon: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400', hover: 'hover:border-violet-300 dark:hover:border-violet-600' },
  'Artificial Intelligence': { bg: 'from-cyan-500 to-cyan-600', icon: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400', hover: 'hover:border-cyan-300 dark:hover:border-cyan-600' },
}

const subjectIcons: Record<string, string> = {
  Mathematics: '\u03C0',
  Science: '\u2697\uFE0F',
  English: '\u{1F4D6}',
  'Hindi (Course A)': '\u{1F4DD}',
  'Social Science': '\u{1F30D}',
  'Artificial Intelligence': '\u{1F916}',
}

export function LandingPage() {
  const { data: subjects, isLoading } = useSubjects()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading subjects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 py-4">
      <div className="text-center py-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Knowledge Hub
        </h1>
        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Class 10 NCERT study material — notes, chapters and more
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects?.map((subject) => {
          const style = subjectStyles[subject.name] || { bg: 'from-gray-500 to-gray-600', icon: 'bg-gray-100 text-gray-600', hover: 'hover:border-gray-300' }
          const icon = subjectIcons[subject.name] || '\u{1F4DA}'
          const chapterCount = subject.chapters?.length || 0

          return (
            <Link
              key={subject.id}
              to={`/subjects/${subject.id}`}
              className="group block"
            >
              <div className={`relative bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/20 ${style.hover}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.bg} flex items-center justify-center text-xl shrink-0 shadow-sm`}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {subject.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/60 px-2 py-0.5 rounded-full">
                        {chapterCount} {chapterCount === 1 ? 'chapter' : 'chapters'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors shrink-0 mt-1" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
