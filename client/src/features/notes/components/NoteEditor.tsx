import { useState } from 'react'
import { EditorContent, useEditor, Editor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Typography } from '@tiptap/extension-typography'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Link } from '@tiptap/extension-link'
import { Underline } from '@tiptap/extension-underline'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Code, Quote, List, ListOrdered, Heading1, Heading2, Heading3,
  Undo2, Redo2, Save, Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUpdateNote } from '@/hooks/useData'
import { htmlToMarkdown, downloadMarkdown } from '@/lib/markdown'
import type { Note } from '@/types'

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
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
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

      <ToolbarButton active={editor.isActive('heading', { level: 1 })} onClick={() => toggleHeading(1)} title="Heading 1">
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive('heading', { level: 2 })} onClick={() => toggleHeading(2)} title="Heading 2">
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive('heading', { level: 3 })} onClick={() => toggleHeading(3)} title="Heading 3">
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

export function NoteEditor({ note }: { note: Note }) {
  const [title, setTitle] = useState(note.title)
  const updateNote = useUpdateNote()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Underline,
      Placeholder.configure({ placeholder: 'Start writing your note...' }),
      Link.configure({ HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
    ],
    content: note.content,
    onUpdate: () => {},
  })

  const handleSave = async () => {
    if (!title.trim() || !editor) return
    try {
      await updateNote.mutateAsync({
        id: note.id,
        title,
        content: editor.getHTML(),
        isPublished: note.isPublished,
      })
    } catch (err) {
      console.error('Failed to save note:', err)
    }
  }

  const handleExportMarkdown = () => {
    if (!editor) return
    const markdown = htmlToMarkdown(editor.getHTML())
    downloadMarkdown(title || 'note', markdown)
  }

  return (
    <div className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-2xl overflow-hidden">
      <Input
        placeholder="Note title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border-0 text-xl font-semibold px-5 py-4 focus-visible:ring-0 bg-transparent"
      />
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none px-5 py-4 min-h-[400px]"
      />
      <div className="border-t border-gray-200 dark:border-gray-700/60 px-5 py-3 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={handleExportMarkdown}>
          <Download className="h-4 w-4 mr-1.5" />
          Export
        </Button>
        <Button size="sm" onClick={handleSave} disabled={updateNote.isPending}>
          <Save className="h-4 w-4 mr-1.5" />
          {updateNote.isPending ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  )
}
