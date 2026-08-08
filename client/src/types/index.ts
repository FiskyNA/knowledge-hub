export interface User {
  id: string
  email: string
  name: string | null
  role: 'USER' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

export interface Subject {
  id: string
  name: string
  description: string | null
  color: string
  icon: string | null
  order: number
  createdAt: string
  updatedAt: string
  chapters?: Chapter[]
}

export interface Chapter {
  id: string
  name: string
  description: string | null
  order: number
  createdAt: string
  updatedAt: string
  subjectId: string
  notes?: Note[]
  files?: File[]
}

export interface File {
  id: string
  name: string
  originalName: string
  path: string
  mimeType: string
  size: number
  extension: string
  createdAt: string
  updatedAt: string
  chapterId?: string | null
  noteId?: string | null
  userId?: string | null
}

export interface Note {
  id: string
  title: string
  content: string
  slug: string | null
  excerpt: string | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
  chapterId?: string | null
  fileId?: string | null
  userId?: string | null
}

export interface NoteTag {
  id: string
  name: string
  color: string
  createdAt: string
}

export interface FileTag {
  id: string
  name: string
  color: string
  createdAt: string
}
