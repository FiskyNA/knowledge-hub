import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { json, urlencoded } from 'body-parser'
import { createServer } from 'http'
import path from 'path'
import fs from 'fs'

import subjectRoutes from './routes/subjects'
import chapterRoutes from './routes/chapters'
import noteRoutes from './routes/notes'
import fileRoutes from './routes/files'
import { client } from './lib/prisma'
import { upload, handleFileUpload } from './middleware/upload'
import { asyncHandler } from './middleware/auth'
import { errorHandler } from './middleware/errorHandler'
import { PUBLIC_USER_ID } from './config'

dotenv.config()

const app = express()
const server = createServer(app)

const uploadDir = process.env.UPLOAD_DIR || './uploads'
if (!fs.existsSync(path.resolve(uploadDir))) {
  fs.mkdirSync(path.resolve(uploadDir), { recursive: true })
}

app.use(cors({
  origin: '*',
  credentials: false,
}))
app.use(json({ limit: '10mb' }))
app.use(urlencoded({ extended: true, limit: '10mb' }))

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/subjects', subjectRoutes)
app.use('/api/chapters', chapterRoutes)
app.use('/api/notes', noteRoutes)
app.use('/api/files', fileRoutes)

app.get('/api/stats', asyncHandler(async (req, res) => {
  const [subjectCount, chapterCount, fileCount, totalSize] = await Promise.all([
    client.subject.count({ where: { userId: PUBLIC_USER_ID } }),
    client.chapter.count({ where: { subject: { userId: PUBLIC_USER_ID } } }),
    client.file.count({ where: { userId: PUBLIC_USER_ID } }),
    client.file.aggregate({ where: { userId: PUBLIC_USER_ID }, _sum: { size: true } }),
  ])
  res.json({
    subjects: subjectCount,
    chapters: chapterCount,
    files: fileCount,
    totalSize: totalSize._sum.size || 0,
  })
}))

app.get('/api/search', asyncHandler(async (req, res) => {
  const { q } = req.query
  if (!q || typeof q !== 'string' || q.trim().length === 0) {
    return res.json({ subjects: [], chapters: [], files: [] })
  }
  const query = q.trim()

  const [subjects, chapters, files] = await Promise.all([
    client.subject.findMany({
      where: { userId: PUBLIC_USER_ID, name: { contains: query } },
      select: { id: true, name: true, description: true },
    }),
    client.chapter.findMany({
      where: { subject: { userId: PUBLIC_USER_ID }, name: { contains: query } },
      select: { id: true, name: true, subjectId: true, subject: { select: { name: true } } },
    }),
    client.file.findMany({
      where: { userId: PUBLIC_USER_ID, originalName: { contains: query } },
      select: { id: true, originalName: true, size: true, chapterId: true, chapter: { select: { name: true, subjectId: true, subject: { select: { name: true } } } } },
      take: 20,
    }),
  ])

  res.json({ subjects, chapters, files })
}))

app.post(
  '/api/upload',
  upload.single('file'),
  asyncHandler(handleFileUpload)
)

app.use(errorHandler)

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)

  client.user.upsert({
    where: { id: PUBLIC_USER_ID },
    update: {},
    create: {
      id: PUBLIC_USER_ID,
      email: 'public@knowledge-hub.local',
      name: 'Public User',
      password: '',
    },
  }).catch(console.error)
})

process.on('SIGTERM', () => {
  server.close(() => {
    client.$disconnect()
    process.exit(0)
  })
})

export { app, server, client }
