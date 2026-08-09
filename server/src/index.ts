import express, { Request, Response } from 'express'
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

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/seed', asyncHandler(async (req: Request, res: Response) => {
  const existing = await client.subject.count({ where: { userId: PUBLIC_USER_ID } })
  if (existing > 0) {
    return res.json({ message: 'Already seeded', subjects: existing })
  }

  const subjects = await Promise.all([
    client.subject.create({
      data: {
        name: 'Mathematics', description: 'NCERT Class 10 Mathematics — 14 chapters', color: '#3b82f6', order: 0, userId: PUBLIC_USER_ID,
        chapters: {
          create: [
            { name: 'Real Numbers', order: 0 },
            { name: 'Polynomials', order: 1 },
            { name: 'Pair of Linear Equations in Two Variables', order: 2 },
            { name: 'Quadratic Equations', order: 3 },
            { name: 'Arithmetic Progressions', order: 4 },
            { name: 'Triangles', order: 5 },
            { name: 'Coordinate Geometry', order: 6 },
            { name: 'Introduction to Trigonometry', order: 7 },
            { name: 'Some Applications of Trigonometry', order: 8 },
            { name: 'Circles', order: 9 },
            { name: 'Areas Related to Circles', order: 10 },
            { name: 'Surface Areas and Volumes', order: 11 },
            { name: 'Statistics', order: 12 },
            { name: 'Probability', order: 13 },
          ],
        },
      },
    }),
    client.subject.create({
      data: {
        name: 'Science', description: 'NCERT Class 10 Science — 13 chapters', color: '#10b981', order: 1, userId: PUBLIC_USER_ID,
        chapters: {
          create: [
            { name: 'Chemical Reactions and Equations', order: 0 },
            { name: 'Acids, Bases and Salts', order: 1 },
            { name: 'Metals and Non-metals', order: 2 },
            { name: 'Carbon and its Compounds', order: 3 },
            { name: 'Life Processes', order: 4 },
            { name: 'Control and Coordination', order: 5 },
            { name: 'How do Organisms Reproduce?', order: 6 },
            { name: 'Heredity', order: 7 },
            { name: 'Light – Reflection and Refraction', order: 8 },
            { name: 'The Human Eye and the Colourful World', order: 9 },
            { name: 'Electricity', order: 10 },
            { name: 'Magnetic Effects of Electric Current', order: 11 },
            { name: 'Our Environment', order: 12 },
          ],
        },
      },
    }),
    client.subject.create({
      data: {
        name: 'English', description: 'NCERT Class 10 English — First Flight & Footprints Without Feet', color: '#f59e0b', order: 2, userId: PUBLIC_USER_ID,
        chapters: {
          create: [
            { name: 'First Flight — A Letter to God', order: 0 },
            { name: 'First Flight — Nelson Mandela: Long Walk to Freedom', order: 1 },
            { name: 'First Flight — Two Stories about Flying', order: 2 },
            { name: 'First Flight — From the Diary of Anne Frank', order: 3 },
            { name: 'First Flight — The Hundred Dresses – I', order: 4 },
            { name: 'First Flight — The Hundred Dresses – II', order: 5 },
            { name: 'First Flight — Glimpses of India', order: 6 },
            { name: 'First Flight — Mijbil the Otter', order: 7 },
            { name: 'First Flight — Madam Rides the Bus', order: 8 },
            { name: 'First Flight — The Sermon at Benares', order: 9 },
            { name: 'First Flight — The Proposal', order: 10 },
            { name: 'Footprints Without Feet — A Triumph of Surgery', order: 11 },
            { name: 'Footprints Without Feet — The Thief\'s Story', order: 12 },
            { name: 'Footprints Without Feet — Footprints without Feet', order: 13 },
            { name: 'Footprints Without Feet — The Making of a Scientist', order: 14 },
            { name: 'Footprints Without Feet — The Necklace', order: 15 },
            { name: 'Footprints Without Feet — The Hack Driver', order: 16 },
            { name: 'Footprints Without Feet — Bholi', order: 17 },
            { name: 'Footprints Without Feet — The Book That Saved the Earth', order: 18 },
          ],
        },
      },
    }),
    client.subject.create({
      data: {
        name: 'Hindi (Course A)', description: 'NCERT Class 10 Hindi Course A — Kshitij & Kritika', color: '#ef4444', order: 3, userId: PUBLIC_USER_ID,
        chapters: {
          create: [
            { name: 'क्षितिज — सूरदास', order: 0 },
            { name: 'क्षितिज — राम विलास शर्मा', order: 1 },
            { name: 'क्षितिज — देव', order: 2 },
            { name: 'क्षितिज — जयशंकर प्रसाद', order: 3 },
            { name: 'क्षितिज — सूर्यकांत त्रिपाठी निराला', order: 4 },
            { name: 'क्षितिज — सह लेखक', order: 5 },
            { name: 'क्षितिज — व्यापारी लोग और लघु उद्योग', order: 6 },
            { name: 'क्षितिज — इफ्तार की नमाज़', order: 7 },
            { name: 'क्षितिज — दो कलाकार', order: 8 },
            { name: 'क्षितिज — यह दशक', order: 9 },
            { name: 'क्षितिज — मनुष्यता', order: 10 },
            { name: 'क्षितिज — डाक घर', order: 11 },
            { name: 'क्षितिज — बड़े भाई साहिब', order: 12 },
            { name: 'कृतिका — माता का आंचल', order: 13 },
            { name: 'कृतिका — जॉर्ज पंचम की नाक', order: 14 },
            { name: 'कृतिका — सान्त्वना', order: 15 },
            { name: 'कृतिका — यह दशक कैसा है', order: 16 },
            { name: 'कृतिका — कारतूस', order: 17 },
          ],
        },
      },
    }),
    client.subject.create({
      data: {
        name: 'Social Science', description: 'NCERT Class 10 Social Science — History, Geography, Political Science, Economics', color: '#8b5cf6', order: 4, userId: PUBLIC_USER_ID,
        chapters: {
          create: [
            { name: 'History — The Rise of Nationalism in Europe', order: 0 },
            { name: 'History — Nationalism in India', order: 1 },
            { name: 'History — The Making of a Global World', order: 2 },
            { name: 'History — The Age of Industrialisation', order: 3 },
            { name: 'History — Print Culture and the Modern World', order: 4 },
            { name: 'Geography — Resources and Development', order: 5 },
            { name: 'Geography — Forest and Wildlife Resources', order: 6 },
            { name: 'Geography — Water Resources', order: 7 },
            { name: 'Geography — Agriculture', order: 8 },
            { name: 'Geography — Minerals and Energy Resources', order: 9 },
            { name: 'Geography — Manufacturing Industries', order: 10 },
            { name: 'Geography — Lifelines of National Economy', order: 11 },
            { name: 'Political Science — Power Sharing', order: 12 },
            { name: 'Political Science — Federalism', order: 13 },
            { name: 'Political Science — Democracy and Diversity', order: 14 },
            { name: 'Political Science — Gender, Religion and Caste', order: 15 },
            { name: 'Political Science — Political Parties', order: 16 },
            { name: 'Political Science — Outcomes of Democracy', order: 17 },
            { name: 'Economics — Development', order: 18 },
            { name: 'Economics — Sectors of the Indian Economy', order: 19 },
            { name: 'Economics — Money and Credit', order: 20 },
            { name: 'Economics — Globalisation and the Indian Economy', order: 21 },
            { name: 'Economics — Consumer Rights', order: 22 },
          ],
        },
      },
    }),
    client.subject.create({
      data: {
        name: 'Artificial Intelligence', description: 'Class 10 AI — Introduced by CBSE', color: '#06b6d4', order: 5, userId: PUBLIC_USER_ID,
        chapters: {
          create: [
            { name: 'Introduction to Artificial Intelligence', order: 0 },
            { name: 'AI Project Cycle', order: 1 },
            { name: 'Data', order: 2 },
            { name: 'Data Exploration', order: 3 },
            { name: 'Introduction to Python', order: 4 },
            { name: 'Python Basics', order: 5 },
            { name: 'Python Libraries', order: 6 },
            { name: 'AI Ethics', order: 7 },
            { name: 'Neural Networks', order: 8 },
            { name: 'Computer Vision', order: 9 },
          ],
        },
      },
    }),
  ])

  res.json({ message: 'Seeded successfully', subjects: subjects.length })
}))

app.use('/api/subjects', subjectRoutes)
app.use('/api/chapters', chapterRoutes)
app.use('/api/notes', noteRoutes)
app.use('/api/files', fileRoutes)

app.get('/api/stats', asyncHandler(async (req: Request, res: Response) => {
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

app.get('/api/search', asyncHandler(async (req: Request, res: Response) => {
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

const clientDist = path.join(process.cwd(), '..', 'client', 'dist')
console.log('Serving client from:', clientDist, 'exists:', fs.existsSync(clientDist))
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.get('*', (req: Request, res: Response) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDist, 'index.html'))
    }
  })
}

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
