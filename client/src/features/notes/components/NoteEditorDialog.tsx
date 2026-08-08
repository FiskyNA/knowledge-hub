import { useState, useEffect } from 'react'
import { EditorContent, useEditor, Editor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Typography } from '@tiptap/extension-typography'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Link as LinkExt } from '@tiptap/extension-link'
import { Underline } from '@tiptap/extension-underline'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Code, Quote, List, ListOrdered, Heading1, Heading2, Heading3,
  Undo2, Redo2, Save
} from 'lucide-react'
import { useCreateNote, useUpdateNote, useNote } from '@/hooks/useData'

const ToolbarButton = ({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean
  onClick: () => void
  children: React.ReactNode
  title?: string
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded-md transition-colors ${
      active
        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
    }`}
  >
    {children}
  </button>
)

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null

  const toggleHeading = (level: 1 | 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run()
  }

  return (
    <div className="flex items-center gap-0.5 px-3 py-2 border-b border-gray-200 dark:border-gray-700/60 overflow-x-auto">
      <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
      <ToolbarButton active={editor.isActive('heading', { level: 1 })} onClick={() => toggleHeading(1)} title="H1">
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive('heading', { level: 2 })} onClick={() => toggleHeading(2)} title="H2">
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive('heading', { level: 3 })} onClick={() => toggleHeading(3)} title="H3">
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>
      <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
      <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered List">
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote">
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} title="Code">
        <Code className="h-4 w-4" />
      </ToolbarButton>
      <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>
    </div>
  )
}

interface NoteEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chapterId?: string
  noteId?: string
  mode: 'create' | 'edit'
}

export function NoteEditorDialog({
  open,
  onOpenChange,
  chapterId,
  noteId,
  mode,
}: NoteEditorDialogProps) {
  const [title, setTitle] = useState('')
  const createNote = useCreateNote()
  const updateNote = useUpdateNote()
  const { data: existingNote } = useNote(noteId || '')

  useEffect(() => {
    if (mode === 'edit' && existingNote) {
      setTitle(existingNote.title)
    }
  }, [existingNote, mode])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Underline,
      Placeholder.configure({ placeholder: 'Start writing...' }),
      LinkExt.configure({ HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
    ],
    content: mode === 'edit' ? existingNote?.content : '',
    onUpdate: () => {},
  })

  useEffect(() => {
    if (open && editor) {
      editor.commands.focus()
    }
  }, [open, editor])

  const handleSave = async () => {
    if (!title.trim()) return
    const noteContent = editor?.getHTML() || ''
    try {
      if (mode === 'create') {
        await createNote.mutateAsync({ title, content: noteContent, chapterId })
      } else if (mode === 'edit' && noteId) {
        await updateNote.mutateAsync({ id: noteId, title, content: noteContent })
      }
      onOpenChange(false)
      setTitle('')
      if (editor) editor.commands.setContent('')
    } catch (err) {
      console.error('Failed to save note:', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle>{mode === 'create' ? 'New Note' : 'Edit Note'}</DialogTitle>
        </DialogHeader>

        <div className="px-5 pb-4 space-y-4">
          <Input
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold border-0 border-b border-gray-200 dark:border-gray-700 rounded-none px-0 focus-visible:ring-0"
          />

          <div className="border border-gray-200 dark:border-gray-700/60 rounded-xl overflow-hidden">
            <MenuBar editor={editor} />
            <EditorContent
              editor={editor}
              className="prose prose-sm dark:prose-invert max-w-none px-4 py-3 min-h-[250px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!title.trim()}>
              <Save className="h-4 w-4 mr-1.5" />
              {createNote.isPending || updateNote.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
