import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, File, Image, FileText, FileCode } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useUploadFile } from '@/hooks/useData'
import { api } from '@/lib/api'

interface FileUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chapterId?: string
}

const FILE_ICONS: Record<string, React.ReactNode> = {
  image: <Image className="h-5 w-5 text-blue-500" />,
  pdf: <FileText className="h-5 w-5 text-red-500" />,
  code: <FileCode className="h-5 w-5 text-purple-500" />,
  default: <File className="h-5 w-5 text-gray-400" />,
}

function getFileInfo(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  const mimeType = file.type
  let icon: React.ReactNode = FILE_ICONS.default

  if (mimeType.startsWith('image/')) icon = FILE_ICONS.image
  else if (mimeType === 'application/pdf' || ext === 'pdf') icon = FILE_ICONS.pdf
  else if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'json', 'xml'].includes(ext))
    icon = FILE_ICONS.code

  return { icon, ext, mimeType }
}

export function FileUploadDialog({ open, onOpenChange, chapterId }: FileUploadDialogProps) {
  const uploadFile = useUploadFile()
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleUpload = async () => {
    if (files.length === 0) return

    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      if (chapterId) formData.append('chapterId', chapterId)

      try {
        await api.post('/upload', formData, {
          onUploadProgress: (e: { loaded: number; total?: number }) => {
            const percent = Math.round((e.loaded * 100) / (e.total || 1))
            setUploadProgress((prev) => ({ ...prev, [file.name]: percent }))
          },
        })
        setUploadProgress((prev) => {
          const n = { ...prev }
          delete n[file.name]
          return n
        })
      } catch (err) {
        console.error('Upload failed:', err)
      }
    }

    setFiles([])
    onOpenChange(false)
  }

  const removeFile = (file: File) => {
    setFiles((prev) => prev.filter((f) => f !== file))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>

        <div className="px-5 pb-5 space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className={`h-10 w-10 mx-auto mb-3 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {isDragActive ? 'Drop files here...' : 'Click or drag files to upload'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              PDF, images, documents, code — max 10MB each
            </p>
          </div>

          {files.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {files.map((file) => {
                const { icon } = getFileInfo(file)
                const progress = uploadProgress[file.name]
                const size = (file.size / 1024).toFixed(1)

                return (
                  <div key={file.name} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg px-3 py-2.5">
                    <div className="w-9 h-9 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center shrink-0">
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{size} KB</p>
                      {progress !== undefined && (
                        <div className="mt-1.5 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFile(file)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleUpload}
              disabled={files.length === 0 || uploadFile.isPending}
            >
              <Upload className="h-4 w-4 mr-1.5" />
              {uploadFile.isPending ? 'Uploading...' : `Upload ${files.length} file(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
