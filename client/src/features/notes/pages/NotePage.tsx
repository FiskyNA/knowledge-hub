import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNote } from '@/hooks/useData'
import { NoteEditor } from '@/features/notes/components/NoteEditor'

export function NotePage() {
  const { noteId } = useParams<{ noteId: string }>()
  const navigate = useNavigate()
  const { data: note, isLoading } = useNote(noteId!)

  if (isLoading) {
    return <div className="text-center py-12">Loading note...</div>
  }

  if (!note) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Note not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <NoteEditor note={note} />
    </div>
  )
}
