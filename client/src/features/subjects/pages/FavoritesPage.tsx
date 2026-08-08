import { useNavigate } from 'react-router-dom'
import { Star, File, Download, ExternalLink, ChevronRight } from 'lucide-react'
import { useFavorites } from '@/hooks/useData'
import { useState } from 'react'

function formatSize(bytes: number): string {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

const gradients = [
  'from-red-500 to-rose-600', 'from-orange-500 to-amber-600',
  'from-violet-500 to-purple-600', 'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600', 'from-pink-500 to-fuchsia-600',
  'from-teal-500 to-cyan-600', 'from-amber-500 to-yellow-600',
]

export function FavoritesPage() {
  const navigate = useNavigate()
  const { data: favorites, isLoading } = useFavorites()
  const [previewFile, setPreviewFile] = useState<string | null>(null)

  return (
    <div className="space-y-6 py-2">
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
        <button onClick={() => navigate('/')} className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Subjects
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-900 dark:text-white font-medium">Favorites</span>
      </nav>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
          <Star className="h-5 w-5 text-white fill-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Favorites</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{favorites?.length || 0} bookmarked files</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : favorites && favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {favorites.map((file, i) => (
            <div key={file.id} className="group bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-xl p-4 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center shrink-0 shadow-sm`}>
                  <File className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate" title={file.originalName}>
                    {file.originalName}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatSize(file.size)}
                  </p>
                  {file.chapter && (
                    <button
                      onClick={() => {
                        const ch = file.chapter
                        if (ch) navigate(`/subjects/${ch.subject.id}/chapters/${ch.id}`)
                      }}
                      className="text-xs text-blue-500 hover:text-blue-600 mt-1 inline-flex items-center gap-1"
                    >
                      {file.chapter.subject.name} &gt; {file.chapter.name}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setPreviewFile(file.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-700/50 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Preview
                </button>
                <a
                  href={`/api/files/${file.id}/download`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Download className="h-3 w-3" />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-2xl p-16 text-center">
          <Star className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No favorites yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Click the star icon on any file to bookmark it</p>
        </div>
      )}

      {/* Inline PDF Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setPreviewFile(null)}>
          <div className="relative w-full max-w-4xl h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">PDF Preview</span>
              <div className="flex items-center gap-2">
                <a href={`/api/files/${previewFile}/download`} className="text-xs text-blue-500 hover:text-blue-600">Download</a>
                <button onClick={() => setPreviewFile(null)} className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  ✕
                </button>
              </div>
            </div>
            <iframe src={`/api/files/${previewFile}/view`} className="flex-1 w-full border-0" title="PDF Preview" />
          </div>
        </div>
      )}
    </div>
  )
}
