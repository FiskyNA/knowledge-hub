import { useParams, useNavigate } from 'react-router-dom'
import { ChevronRight, Upload, File, Download, FileIcon as FileLucideIcon, ExternalLink, ArrowUpDown, Pencil, Check, X, Search, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChapters, useFiles, useSubject } from '@/hooks/useData'
import { useState, useMemo } from 'react'
import { FileUploadDialog } from '@/features/files/components/FileUploadDialog'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'

function formatFileSize(bytes: number): string {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

type SortKey = 'name' | 'size' | 'date'
type SortDir = 'asc' | 'desc'

function sortFiles(files: any[], sortKey: SortKey, sortDir: SortDir) {
  return [...files].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'name') cmp = a.originalName.localeCompare(b.originalName)
    else if (sortKey === 'size') cmp = a.size - b.size
    else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    return sortDir === 'asc' ? cmp : -cmp
  })
}

const pdfColors = [
  'from-red-500 to-rose-600', 'from-orange-500 to-amber-600',
  'from-pink-500 to-fuchsia-600', 'from-red-600 to-pink-600',
  'from-rose-500 to-red-600', 'from-amber-500 to-orange-600',
  'from-fuchsia-500 to-pink-600', 'from-red-400 to-rose-500',
]

const acpColors = [
  'from-violet-500 to-purple-600', 'from-indigo-500 to-blue-600',
  'from-purple-500 to-violet-600', 'from-blue-500 to-indigo-600',
  'from-violet-600 to-purple-700', 'from-indigo-600 to-blue-700',
  'from-purple-600 to-violet-700', 'from-blue-600 to-indigo-700',
]

const revisionColors = [
  'from-teal-500 to-cyan-600', 'from-cyan-500 to-sky-600',
  'from-emerald-500 to-teal-600', 'from-sky-500 to-blue-600',
  'from-teal-600 to-cyan-700', 'from-cyan-600 to-sky-700',
  'from-emerald-600 to-teal-700', 'from-sky-600 to-blue-700',
]

const wppColors = [
  'from-amber-500 to-yellow-600', 'from-yellow-500 to-amber-600',
  'from-orange-500 to-amber-600', 'from-lime-500 to-green-600',
  'from-amber-600 to-yellow-700', 'from-yellow-600 to-amber-700',
  'from-orange-600 to-amber-700', 'from-lime-600 to-green-700',
]

const moduleColors = [
  'from-blue-500 to-indigo-600', 'from-indigo-500 to-violet-600',
  'from-sky-500 to-blue-600', 'from-blue-600 to-indigo-700',
  'from-indigo-600 to-violet-700', 'from-sky-600 to-blue-700',
  'from-blue-400 to-indigo-500', 'from-indigo-400 to-violet-500',
]

const testColors = [
  'from-rose-500 to-red-600', 'from-pink-500 to-rose-600',
  'from-red-400 to-rose-500', 'from-rose-400 to-pink-500',
  'from-red-500 to-rose-500', 'from-pink-400 to-rose-500',
  'from-rose-600 to-red-700', 'from-pink-600 to-rose-700',
]

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'size', label: 'Size' },
  { key: 'date', label: 'Date' },
]

function FileCard({ file, colorClass, onPreview }: { file: any; colorClass: string; onPreview?: (id: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(file.originalName)
  const queryClient = useQueryClient()

  const handleSave = async () => {
    if (editName.trim() && editName !== file.originalName) {
      await api.patch(`/files/${file.id}`, { originalName: editName.trim() })
      queryClient.invalidateQueries({ queryKey: ['files'] })
    }
    setEditing(false)
  }

  return (
    <div className="group relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/40 dark:to-gray-700/20 border border-gray-200 dark:border-gray-600/50 rounded-xl p-4 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200">
      <button
        onClick={async () => {
          await api.patch(`/files/${file.id}/favorite`)
          queryClient.invalidateQueries({ queryKey: ['files'] })
        }}
        className="absolute top-3 right-3 p-1 text-gray-300 dark:text-gray-600 hover:text-amber-400 dark:hover:text-amber-400 transition-colors opacity-0 group-hover:opacity-100"
        title={file.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star className={`h-4 w-4 ${file.isFavorite ? 'fill-amber-400 text-amber-400 opacity-100' : ''} ${!file.isFavorite ? 'opacity-0 group-hover:opacity-100' : ''}`} />
      </button>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center shrink-0 shadow-sm`}>
          <FileLucideIcon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex items-center gap-1">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }}
                className="text-sm font-medium bg-white dark:bg-gray-800 border border-blue-400 rounded px-1.5 py-0.5 w-full text-gray-900 dark:text-white outline-none"
                autoFocus
              />
              <button onClick={handleSave} className="p-0.5 text-green-500 hover:text-green-600"><Check className="h-3.5 w-3.5" /></button>
              <button onClick={() => setEditing(false)} className="p-0.5 text-gray-400 hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
            </div>
          ) : (
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate flex items-center gap-1" title={file.originalName}>
              {file.originalName}
              <button
                onClick={() => setEditing(true)}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-blue-500 transition-all shrink-0"
              >
                <Pencil className="h-3 w-3" />
              </button>
            </h3>
          )}
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(file.size)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        {onPreview ? (
          <button
            onClick={() => onPreview(file.id)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-700/50 rounded-lg transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            Preview
          </button>
        ) : (
          <a
            href={`/api/files/${file.id}/view`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-700/50 rounded-lg transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            View
          </a>
        )}
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

function FileSection({ title, iconColor, files, colorPalette, sortKey, sortDir, onSortChange, onDownloadAll, onUpload, onPreview }: {
  title: string; iconColor: string; files: any[]; colorPalette: string[];
  sortKey: SortKey; sortDir: SortDir; onSortChange: (k: SortKey) => void; onDownloadAll: () => void; onUpload: () => void; onPreview?: (id: string) => void
}) {
  const [showSort, setShowSort] = useState(false)
  const sorted = useMemo(() => sortFiles(files, sortKey, sortDir), [files, sortKey, sortDir])

  return (
    <div className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
        <File className={`h-4 w-4 ${iconColor}`} />
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({files.length})</span>
        <div className="flex-1" />
        {files.length > 0 && (
          <div className="flex items-center gap-1">
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                title="Sort"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[100px]">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => { onSortChange(opt.key); setShowSort(false) }}
                      className={`w-full text-left px-3 py-1.5 text-xs ${sortKey === opt.key ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-50 dark:hover:bg-gray-700/50`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={onDownloadAll}
              className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              title="Download all"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {files.length > 0 ? (
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {sorted.map((file: any, i: number) => (
              <FileCard key={file.id} file={file} colorClass={colorPalette[i % colorPalette.length]} onPreview={onPreview} />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-12 text-center">
          <File className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No {title.toLowerCase()} yet</p>
          <button onClick={onUpload} className="text-sm text-blue-500 hover:text-blue-600 mt-1">
            Upload your first {title.toLowerCase().replace(/s$/, '')}
          </button>
        </div>
      )}
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
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir] = useState<SortDir>('asc')
  const [searchQuery, setSearchQuery] = useState('')
  const [previewFile, setPreviewFile] = useState<string | null>(null)

  const chapterData = chapters?.find((c) => c.id === chapterId)
  const isScience = subject?.name === 'Science'
  const isSS = subject?.name === 'Social Science'
  const isMath = subject?.name === 'Mathematics'

  const acpFiles = files?.filter((f) => f.originalName.toUpperCase().includes('ACP')) || []
  const revisionFiles = files?.filter((f) => f.originalName.toUpperCase().includes('REVISION')) || []
  const wppFiles = files?.filter((f) => f.originalName.toUpperCase().includes('WPP')) || []
  const moduleFiles = files?.filter((f) => f.originalName.toUpperCase().includes('MODULE')) || []
  const testFiles = files?.filter((f) => f.originalName.toUpperCase().includes('TEST')) || []

  const filterBySearch = (list: any[]) => {
    if (!searchQuery.trim()) return list
    const q = searchQuery.toLowerCase()
    return list.filter((f) => f.originalName.toLowerCase().includes(q))
  }

  const notes = (() => {
    const base = (() => {
      if (isScience) return files?.filter((f) => !f.originalName.toUpperCase().includes('ACP') && !f.originalName.toUpperCase().includes('TEST')) || []
      if (isSS) return files?.filter((f) => !f.originalName.toUpperCase().includes('REVISION') && !f.originalName.toUpperCase().includes('WPP')) || []
      if (isMath) return files?.filter((f) => !f.originalName.toUpperCase().includes('MODULE') && !f.originalName.toUpperCase().includes('TEST')) || []
      return files?.filter((f) => !f.originalName.toUpperCase().includes('TEST')) || []
    })()
    return filterBySearch(base)
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
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
        <button onClick={() => navigate('/')} className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Subjects
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <button onClick={() => navigate(`/subjects/${subjectId}`)} className="hover:text-gray-900 dark:hover:text-white transition-colors">
          {subject?.name || 'Subject'}
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">{chapterData.name}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{chapterData.name}</h1>
        <Button variant="outline" size="sm" onClick={() => setIsFileDialogOpen(true)}>
          <Upload className="h-4 w-4 mr-1.5" />
          Upload
        </Button>
      </div>

      <FileUploadDialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen} chapterId={chapterId} />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
        />
      </div>

      {/* Notes Section */}
      <FileSection title="Notes" iconColor="text-emerald-500" files={notes} colorPalette={pdfColors} sortKey={sortKey} sortDir={sortDir} onSortChange={setSortKey} onUpload={() => setIsFileDialogOpen(true)} onDownloadAll={() => notes.forEach((f: any) => window.open(`/api/files/${f.id}/download`, '_blank'))} onPreview={setPreviewFile} />

      {/* ACP Section - Science only */}
      {isScience && (
        <FileSection title="ACP" iconColor="text-violet-500" files={filterBySearch(acpFiles)} colorPalette={acpColors} sortKey={sortKey} sortDir={sortDir} onSortChange={setSortKey} onUpload={() => setIsFileDialogOpen(true)} onDownloadAll={() => acpFiles.forEach((f: any) => window.open(`/api/files/${f.id}/download`, '_blank'))} onPreview={setPreviewFile} />
      )}

      {/* Chapter-wise Test - All subjects */}
      <FileSection title="Chapter-wise Test" iconColor="text-rose-500" files={filterBySearch(testFiles)} colorPalette={testColors} sortKey={sortKey} sortDir={sortDir} onSortChange={setSortKey} onUpload={() => setIsFileDialogOpen(true)} onDownloadAll={() => testFiles.forEach((f: any) => window.open(`/api/files/${f.id}/download`, '_blank'))} onPreview={setPreviewFile} />

      {/* Revision Section - Social Science only */}
      {isSS && (
        <FileSection title="Revision Notes" iconColor="text-teal-500" files={filterBySearch(revisionFiles)} colorPalette={revisionColors} sortKey={sortKey} sortDir={sortDir} onSortChange={setSortKey} onUpload={() => setIsFileDialogOpen(true)} onDownloadAll={() => revisionFiles.forEach((f: any) => window.open(`/api/files/${f.id}/download`, '_blank'))} onPreview={setPreviewFile} />
      )}

      {/* WPP Section - Social Science only */}
      {isSS && (
        <FileSection title="WPP" iconColor="text-amber-500" files={filterBySearch(wppFiles)} colorPalette={wppColors} sortKey={sortKey} sortDir={sortDir} onSortChange={setSortKey} onUpload={() => setIsFileDialogOpen(true)} onDownloadAll={() => wppFiles.forEach((f: any) => window.open(`/api/files/${f.id}/download`, '_blank'))} onPreview={setPreviewFile} />
      )}

      {/* Module Section - Math only */}
      {isMath && (
        <FileSection title="Module" iconColor="text-blue-500" files={filterBySearch(moduleFiles)} colorPalette={moduleColors} sortKey={sortKey} sortDir={sortDir} onSortChange={setSortKey} onUpload={() => setIsFileDialogOpen(true)} onDownloadAll={() => moduleFiles.forEach((f: any) => window.open(`/api/files/${f.id}/download`, '_blank'))} onPreview={setPreviewFile} />
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
                  <X className="h-4 w-4" />
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
