import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Upload, File, Download, FileIcon as FileLucideIcon, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChapters, useFiles, useSubject } from '@/hooks/useData'
import { useState } from 'react'
import { FileUploadDialog } from '@/features/files/components/FileUploadDialog'

function formatFileSize(bytes: number): string {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

const pdfColors = [
  'from-red-500 to-rose-600',
  'from-orange-500 to-amber-600',
  'from-pink-500 to-fuchsia-600',
  'from-red-600 to-pink-600',
  'from-rose-500 to-red-600',
  'from-amber-500 to-orange-600',
  'from-fuchsia-500 to-pink-600',
  'from-red-400 to-rose-500',
]

const acpColors = [
  'from-violet-500 to-purple-600',
  'from-indigo-500 to-blue-600',
  'from-purple-500 to-violet-600',
  'from-blue-500 to-indigo-600',
  'from-violet-600 to-purple-700',
  'from-indigo-600 to-blue-700',
  'from-purple-600 to-violet-700',
  'from-blue-600 to-indigo-700',
]

const revisionColors = [
  'from-teal-500 to-cyan-600',
  'from-cyan-500 to-sky-600',
  'from-emerald-500 to-teal-600',
  'from-sky-500 to-blue-600',
  'from-teal-600 to-cyan-700',
  'from-cyan-600 to-sky-700',
  'from-emerald-600 to-teal-700',
  'from-sky-600 to-blue-700',
]

const wppColors = [
  'from-amber-500 to-yellow-600',
  'from-yellow-500 to-amber-600',
  'from-orange-500 to-amber-600',
  'from-lime-500 to-green-600',
  'from-amber-600 to-yellow-700',
  'from-yellow-600 to-amber-700',
  'from-orange-600 to-amber-700',
  'from-lime-600 to-green-700',
]

function FileCard({ file, colorClass }: { file: any; colorClass: string }) {
  return (
    <div className="group relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/40 dark:to-gray-700/20 border border-gray-200 dark:border-gray-600/50 rounded-xl p-4 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center shrink-0 shadow-sm`}>
          <FileLucideIcon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate" title={file.originalName}>
            {file.originalName}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <a
          href={`/api/files/${file.id}/view`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-700/50 rounded-lg transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          View
        </a>
        <a
          href={`/api/files/${file.id}/download`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Download className="h-3 w-3" />
          Download
        </a>
      </div>
    </div>
  )
}

export function ChapterPage() {
  const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>()
  const navigate = useNavigate()
  const { data: chapters } = useChapters(subjectId || '')
  const { data: subject } = useSubject(subjectId || '')
  const { data: files } = useFiles(chapterId)
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)

  const chapterData = chapters?.find((c) => c.id === chapterId)
  const isScience = subject?.name === 'Science'
  const isSS = subject?.name === 'Social Science'

  const acpFiles = files?.filter((f) => f.originalName.toUpperCase().includes('ACP')) || []
  const revisionFiles = files?.filter((f) => f.originalName.toUpperCase().includes('REVISION')) || []
  const wppFiles = files?.filter((f) => f.originalName.toUpperCase().includes('WPP')) || []

  const notes = (() => {
    if (isScience) return files?.filter((f) => !f.originalName.toUpperCase().includes('ACP')) || []
    if (isSS) return files?.filter((f) => !f.originalName.toUpperCase().includes('REVISION') && !f.originalName.toUpperCase().includes('WPP')) || []
    return files || []
  })()

  if (!chapterData) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 py-2">
      <button
        onClick={() => navigate(`/subjects/${subjectId}`)}
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to chapters
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{chapterData.name}</h1>
        <Button variant="outline" size="sm" onClick={() => setIsFileDialogOpen(true)}>
          <Upload className="h-4 w-4 mr-1.5" />
          Upload
        </Button>
      </div>

      <FileUploadDialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen} chapterId={chapterId} />

      {/* Notes Section */}
      <div className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
          <File className="h-4 w-4 text-emerald-500" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Notes</h2>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({notes.length})</span>
        </div>

        {notes.length > 0 ? (
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {notes.map((file, i) => (
                <FileCard key={file.id} file={file} colorClass={pdfColors[i % pdfColors.length]} />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <File className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No notes uploaded yet</p>
            <button
              onClick={() => setIsFileDialogOpen(true)}
              className="text-sm text-blue-500 hover:text-blue-600 mt-1"
            >
              Upload your first note
            </button>
          </div>
        )}
      </div>

      {/* ACP Section - Science only */}
      {isScience && (
      <div className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
          <File className="h-4 w-4 text-violet-500" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">ACP</h2>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({acpFiles.length})</span>
        </div>

        {acpFiles.length > 0 ? (
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {acpFiles.map((file, i) => (
                <FileCard key={file.id} file={file} colorClass={acpColors[i % acpColors.length]} />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <File className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No ACPs uploaded yet</p>
            <button
              onClick={() => setIsFileDialogOpen(true)}
              className="text-sm text-blue-500 hover:text-blue-600 mt-1"
            >
              Upload your first ACP
            </button>
          </div>
        )}
      </div>
      )}

      {/* Revision Section - Social Science only */}
      {isSS && (
      <div className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
          <File className="h-4 w-4 text-teal-500" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Revision Notes</h2>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({revisionFiles.length})</span>
        </div>

        {revisionFiles.length > 0 ? (
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {revisionFiles.map((file, i) => (
                <FileCard key={file.id} file={file} colorClass={revisionColors[i % revisionColors.length]} />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <File className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No revision notes uploaded yet</p>
            <button
              onClick={() => setIsFileDialogOpen(true)}
              className="text-sm text-blue-500 hover:text-blue-600 mt-1"
            >
              Upload your first revision note
            </button>
          </div>
        )}
      </div>
      )}

      {/* WPP Section - Social Science only */}
      {isSS && (
      <div className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
          <File className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">WPP</h2>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({wppFiles.length})</span>
        </div>

        {wppFiles.length > 0 ? (
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {wppFiles.map((file, i) => (
                <FileCard key={file.id} file={file} colorClass={wppColors[i % wppColors.length]} />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <File className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No WPPs uploaded yet</p>
            <button
              onClick={() => setIsFileDialogOpen(true)}
              className="text-sm text-blue-500 hover:text-blue-600 mt-1"
            >
              Upload your first WPP
            </button>
          </div>
        )}
      </div>
      )}
    </div>
  )
}
