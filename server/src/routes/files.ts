import { Router, Request, Response } from 'express'
import path from 'path'
import fs from 'fs/promises'
import { client } from '../lib/prisma'
import { asyncHandler } from '../middleware/auth'
import { PUBLIC_USER_ID } from '../config'

const router = Router()

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { chapterId } = req.query

    const where: any = { userId: PUBLIC_USER_ID }
    if (chapterId) {
      where.chapterId = chapterId as string
    }

    const files = await client.file.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    res.json(files)
  })
)

router.get(
  '/favorites',
  asyncHandler(async (req: Request, res: Response) => {
    const files = await client.file.findMany({
      where: { userId: PUBLIC_USER_ID, isFavorite: true },
      orderBy: { updatedAt: 'desc' },
      include: { chapter: { select: { id: true, name: true, subject: { select: { id: true, name: true } } } } },
    })
    res.json(files)
  })
)

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const file = await client.file.findUnique({
      where: { id, userId: PUBLIC_USER_ID },
    })

    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    res.json(file)
  })
)

router.get(
  '/:id/download',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const file = await client.file.findUnique({
      where: { id, userId: PUBLIC_USER_ID },
    })

    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    if (file.path.startsWith('http')) {
      return res.redirect(file.path)
    }

    const filePath = path.join(process.env.UPLOAD_DIR || './uploads', file.path)
    res.download(filePath, file.originalName)
  })
)

router.get(
  '/:id/view',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const file = await client.file.findUnique({
      where: { id, userId: PUBLIC_USER_ID },
    })

    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    if (file.path.startsWith('http')) {
      return res.redirect(file.path)
    }

    const filePath = path.resolve(process.env.UPLOAD_DIR || './uploads', file.path)
    res.setHeader('Content-Type', file.mimeType)
    res.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`)
    res.sendFile(filePath)
  })
)

router.patch(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const { originalName } = req.body

    if (!originalName) {
      return res.status(400).json({ message: 'originalName is required' })
    }

    const file = await client.file.findUnique({
      where: { id, userId: PUBLIC_USER_ID },
    })

    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    const updated = await client.file.update({
      where: { id, userId: PUBLIC_USER_ID },
      data: { originalName },
    })

    res.json(updated)
  })
)

router.patch(
  '/:id/favorite',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const file = await client.file.findUnique({
      where: { id, userId: PUBLIC_USER_ID },
    })

    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    const updated = await client.file.update({
      where: { id, userId: PUBLIC_USER_ID },
      data: { isFavorite: !file.isFavorite },
    })

    res.json(updated)
  })
)

router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const file = await client.file.findUnique({
      where: { id, userId: PUBLIC_USER_ID },
    })

    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    if (!file.path.startsWith('http')) {
      const filePath = path.join(process.env.UPLOAD_DIR || './uploads', file.path)
      try {
        await fs.unlink(filePath)
      } catch (err) {
        console.warn('File not found on disk:', filePath)
      }
    }

    await client.file.delete({ where: { id, userId: PUBLIC_USER_ID } })
    res.status(204).send()
  })
)

export default router
