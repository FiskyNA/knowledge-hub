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
