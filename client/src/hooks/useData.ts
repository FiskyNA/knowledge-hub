import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Subject, Chapter, Note, File as FileInfo } from '@/types'

export interface Stats {
  subjects: number
  chapters: number
  files: number
  totalSize: number
}

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data } = await api.get<Stats>('/stats')
      return data
    },
  })
}

export interface SearchResult {
  subjects: { id: string; name: string; description: string | null }[]
  chapters: { id: string; name: string; subjectId: string; subject: { name: string } }[]
  files: { id: string; originalName: string; size: number; chapterId: string | null; chapter: { name: string; subjectId: string; subject: { name: string } } | null }[]
}

export const useSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const { data } = await api.get<SearchResult>('/search', { params: { q: query } })
      return data
    },
    enabled: query.trim().length > 0,
  })
}

export const useSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data } = await api.get<Subject[]>('/subjects')
      return data
    },
  })
}

export const useSubject = (id: string) => {
  return useQuery({
    queryKey: ['subject', id],
    queryFn: async () => {
      const { data } = await api.get<Subject>(`/subjects/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export const useCreateSubject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { name: string; description?: string; color?: string; icon?: string }) =>
      api.post('/subjects', payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    },
  })
}

export const useUpdateSubject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; name?: string; description?: string; color?: string; icon?: string }) =>
      api.put(`/subjects/${id}`, payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    },
  })
}

export const useDeleteSubject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/subjects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    },
  })
}

export const useChapters = (subjectId?: string) => {
  return useQuery({
    queryKey: ['chapters', subjectId],
    queryFn: async () => {
      const url = subjectId ? `/chapters?subjectId=${subjectId}` : '/chapters'
      const { data } = await api.get<Chapter[]>(url)
      return data
    },
    enabled: !!subjectId,
  })
}

export const useChaptersAll = () => {
  return useQuery({
    queryKey: ['chapters-all'],
    queryFn: async () => {
      const { data } = await api.get<Chapter[]>('/chapters')
      return data
    },
  })
}

export const useCreateChapter = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { name: string; description?: string; subjectId: string }) =>
      api.post('/chapters', payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] })
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    },
  })
}

export const useUpdateChapter = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; name?: string; description?: string }) =>
      api.put(`/chapters/${id}`, payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] })
    },
  })
}

export const useDeleteChapter = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/chapters/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] })
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    },
  })
}

export const useNotes = (chapterId?: string) => {
  return useQuery({
    queryKey: ['notes', chapterId],
    queryFn: async () => {
      const url = chapterId ? `/notes?chapterId=${chapterId}` : '/notes'
      const { data } = await api.get<Note[]>(url)
      return data
    },
  })
}

export const useNote = (id: string) => {
  return useQuery({
    queryKey: ['note', id],
    queryFn: async () => {
      const { data } = await api.get<Note>(`/notes/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export const useCreateNote = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { title: string; content: string; chapterId?: string }) =>
      api.post('/notes', payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export const useUpdateNote = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; title: string; content: string; isPublished?: boolean }) =>
      api.put(`/notes/${id}`, payload).then((res) => res.data),
    onSuccess: (data: Note) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['note', data.id] })
    },
  })
}

export const useDeleteNote = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/notes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export const useFiles = (chapterId?: string) => {
  return useQuery({
    queryKey: ['files', chapterId],
    queryFn: async () => {
      const url = chapterId ? `/files?chapterId=${chapterId}` : '/files'
      const { data } = await api.get<FileInfo[]>(url)
      return data
    },
  })
}

export interface FavoriteFile extends FileInfo {
  chapter: {
    id: string
    name: string
    subject: { id: string; name: string }
  } | null
}

export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data } = await api.get<FavoriteFile[]>('/files/favorites')
      return data
    },
  })
}

export const useUploadFile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) => api.post('/upload', formData).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
    },
  })
}

export const useDeleteFile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/files/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
    },
  })
}
