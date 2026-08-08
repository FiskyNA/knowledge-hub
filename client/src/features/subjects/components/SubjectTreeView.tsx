import { useState } from 'react'
import {
  Plus,
  BookOpen,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Trash2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  useSubjects,
  useChapters,
  useCreateSubject,
  useDeleteSubject,
} from '@/hooks/useData'
import type { Subject, Chapter } from '@/types'

export function SubjectTreeView() {
  const { data: subjects, isLoading } = useSubjects()
  const createSubject = useCreateSubject()
  const deleteSubject = useDeleteSubject()
  const [openSubjectId, setOpenSubjectId] = useState<string | null>(null)
  const [newSubjectName, setNewSubjectName] = useState('')
  const [newSubjectDesc, setNewSubjectDesc] = useState('')

  const handleCreateSubject = async () => {
    if (!newSubjectName.trim()) return
    await createSubject.mutateAsync({ name: newSubjectName, description: newSubjectDesc })
    setNewSubjectName('')
    setNewSubjectDesc('')
  }

  const handleDeleteSubject = async (id: string) => {
    if (confirm('Delete this subject?')) {
      await deleteSubject.mutateAsync(id)
    }
  }

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading subjects...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Subjects</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subject</DialogTitle>
              <DialogDescription>Add a new subject to organize your notes.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Subject Name</Label>
                <Input
                  placeholder="e.g., Mathematics"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="What is this subject about?"
                  value={newSubjectDesc}
                  onChange={(e) => setNewSubjectDesc(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setNewSubjectName(''); setNewSubjectDesc('') }}>Cancel</Button>
              <Button onClick={handleCreateSubject} disabled={!newSubjectName.trim()}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {subjects?.map((subject) => (
          <SubjectItem
            key={subject.id}
            subject={subject}
            isOpen={openSubjectId === subject.id}
            onToggle={(id) => setOpenSubjectId(openSubjectId === id ? null : id)}
            onDelete={() => handleDeleteSubject(subject.id)}
          />
        ))}
      </div>

      {subjects?.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500">No subjects yet. Create your first subject.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function SubjectItem({
  subject,
  isOpen,
  onToggle,
  onDelete,
}: {
  subject: Subject
  isOpen: boolean
  onToggle: (id: string) => void
  onDelete: () => void
}) {
  const { data: chapters } = useChapters(subject.id)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onToggle(subject.id)}
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: subject.color || '#3b82f6' }}
            />
            <CardTitle className="text-lg">{subject.name}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Plus className="h-4 w-4 mr-2" />
                Add Chapter
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {subject.description && !isOpen && (
          <p className="text-sm text-gray-500 mt-1">{subject.description}</p>
        )}
      </CardHeader>

      {isOpen && (
        <CardContent>
          {subject.description && (
            <p className="text-sm text-gray-500 mb-3">{subject.description}</p>
          )}
          <div className="space-y-2">
            {chapters?.map((chapter) => (
              <ChapterItem key={chapter.id} chapter={chapter} />
            ))}
            {chapters?.length === 0 && (
              <p className="text-sm text-gray-500">No chapters yet.</p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

function ChapterItem({ chapter }: { chapter: Chapter }) {
  return (
    <div className="group flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium">{chapter.name}</span>
      </div>
      <span className="text-xs text-gray-500">
        {chapter.notes?.length || 0} notes
      </span>
    </div>
  )
}
