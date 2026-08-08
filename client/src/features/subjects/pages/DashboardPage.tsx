import { useNavigate } from 'react-router-dom'
import { BookOpen, FileText, HardDrive, Layers, ChevronRight } from 'lucide-react'
import { useStats, useSubjects, useChaptersAll } from '@/hooks/useData'

function formatSize(bytes: number): string {
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

const subjectColors: Record<string, string> = {
  Mathematics: 'from-blue-500 to-blue-600',
  Science: 'from-emerald-500 to-emerald-600',
  English: 'from-amber-500 to-amber-600',
  'Hindi (Course A)': 'from-red-500 to-red-600',
  'Social Science': 'from-violet-500 to-violet-600',
  'Artificial Intelligence': 'from-cyan-500 to-cyan-600',
}

const subjectIcons: Record<string, string> = {
  Mathematics: '\u03C0',
  Science: '\u2697\uFE0F',
  English: '\u{1F4D6}',
  'Hindi (Course A)': '\u{1F4DD}',
  'Social Science': '\u{1F30D}',
  'Artificial Intelligence': '\u{1F916}',
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: stats } = useStats()
  const { data: subjects } = useSubjects()
  const { data: chapters } = useChaptersAll()

  return (
    <div className="space-y-8 py-2">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Knowledge Hub</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Class 10 NCERT study notes and resources</p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: 'Subjects', value: stats.subjects, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { icon: Layers, label: 'Chapters', value: stats.chapters, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
            { icon: FileText, label: 'Files', value: stats.files, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
            { icon: HardDrive, label: 'Total Size', value: formatSize(stats.totalSize), color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Subjects */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subjects</h2>
        {subjects && subjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => {
              const color = subjectColors[subject.name] || 'from-gray-500 to-gray-600'
              const icon = subjectIcons[subject.name] || '\u{1F4DA}'
              const subjectChapters = chapters?.filter((c) => c.subjectId === subject.id) || []
              const totalFiles = subjectChapters.reduce((sum, c) => sum + (c._count?.files || 0), 0)

              return (
                <button
                  key={subject.id}
                  onClick={() => navigate(`/subjects/${subject.id}`)}
                  className="group bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 text-left hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-xl shrink-0 shadow-sm`}>
                      {icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {subjectChapters.length} chapters &middot; {totalFiles} files
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors shrink-0 mt-1" />
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-2xl p-12 text-center">
            <BookOpen className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No subjects yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
