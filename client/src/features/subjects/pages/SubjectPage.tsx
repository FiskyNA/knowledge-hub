import { useParams, useNavigate } from 'react-router-dom'
import { ChevronRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSubject, useChapters } from '@/hooks/useData'

const subjectStyles: Record<string, { bg: string; text: string }> = {
  Mathematics: { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600 dark:text-blue-400' },
  Science: { bg: 'from-emerald-500 to-emerald-600', text: 'text-emerald-600 dark:text-emerald-400' },
  English: { bg: 'from-amber-500 to-amber-600', text: 'text-amber-600 dark:text-amber-400' },
  'Hindi (Course A)': { bg: 'from-red-500 to-red-600', text: 'text-red-600 dark:text-red-400' },
  'Social Science': { bg: 'from-violet-500 to-violet-600', text: 'text-violet-600 dark:text-violet-400' },
  'Artificial Intelligence': { bg: 'from-cyan-500 to-cyan-600', text: 'text-cyan-600 dark:text-cyan-400' },
}

const subjectIcons: Record<string, string> = {
  Mathematics: '\u03C0',
  Science: '\u2697\uFE0F',
  English: '\u{1F4D6}',
  'Hindi (Course A)': '\u{1F4DD}',
  'Social Science': '\u{1F30D}',
  'Artificial Intelligence': '\u{1F916}',
}

export function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>()
  const navigate = useNavigate()
  const { data: subject, isLoading: subjectLoading } = useSubject(subjectId!)
  const { data: chapters, isLoading: chaptersLoading } = useChapters(subjectId)

  if (subjectLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="text-center py-16">
        <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 mb-4">Subject not found</p>
        <Button variant="ghost" onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    )
  }

  const style = subjectStyles[subject.name] || { bg: 'from-gray-500 to-gray-600', text: 'text-gray-600' }
  const icon = subjectIcons[subject.name] || '\u{1F4DA}'

  return (
    <div className="space-y-6 py-2">
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
        <button onClick={() => navigate('/')} className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Subjects
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-900 dark:text-white font-medium">{subject.name}</span>
      </nav>

      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${style.bg} flex items-center justify-center text-2xl shrink-0 shadow-md`}>
          {icon}
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{subject.name}</h1>
          {subject.description && (
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">{subject.description}</p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/40">
          <h2 className={`text-sm font-semibold ${style.text}`}>
            {chapters?.length || 0} {chapters?.length === 1 ? 'Chapter' : 'Chapters'}
          </h2>
        </div>

        {chaptersLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : chapters && chapters.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/40">
            {chapters.map((chapter, i) => (
              <button
                key={chapter.id}
                onClick={() => navigate(`/subjects/${subjectId}/chapters/${chapter.id}`)}
                className="w-full text-left px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
              >
                <span className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-1">
                  {chapter.name}
                </span>
                {chapter._count && chapter._count.files > 0 && (
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full shrink-0">
                    {chapter._count.files} {chapter._count.files === 1 ? 'file' : 'files'}
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <BookOpen className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No chapters yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
