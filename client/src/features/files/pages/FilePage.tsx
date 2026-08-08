import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Download, Share2, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { useState } from 'react'

export function FilePage() {
  const { fileId } = useParams<{ fileId: string }>()
  const navigate = useNavigate()
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    window.open(`${import.meta.env.VITE_API_URL}/files/${fileId}/download`, '_blank')
  }

  const handlePreview = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/files/${fileId}`)
      if (data.mimeType.startsWith('image/')) {
        setPreview(`${import.meta.env.VITE_API_URL.replace('/api', '')}/uploads/${data.path}`)
      } else if (data.mimeType === 'application/pdf') {
        setPreview(`https://docs.google.com/gview?url=${encodeURIComponent(`${import.meta.env.VITE_API_URL.replace('/api', '')}/uploads/${data.path}`)}&embedded=true`)
      } else {
        setPreview(null)
      }
    } catch (err) {
      console.error('Preview error:', err)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePreview} disabled={loading}>
            {loading ? 'Loading...' : 'Preview'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {preview ? (
        <Card className="border-border/50">
          <CardContent className="p-6">
            <iframe
              src={preview}
              className="w-full h-[600px] border rounded-lg"
              title="File Preview"
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <File className="h-8 w-8 text-muted-foreground" />
              File Viewer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">File ID: {fileId}</p>
            <div className="space-y-2">
              <Badge variant="secondary">
                Click "Preview" to view the file content
              </Badge>
              <p className="text-sm text-muted-foreground">
                Supported previews: images, PDFs. Other file types can be downloaded.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
