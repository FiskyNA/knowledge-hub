import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
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

    const notes = await client.note.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: { chapter: true },
    })
    res.json(notes)
  })
)

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const note = await client.note.findUnique({
      where: { id, userId: PUBLIC_USER_ID },
      include: { chapter: true },
    })

    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }

    res.json(note)
  })
)

router.post(
  '/',
  [
    body('title').notEmpty().trim(),
    body('content').notEmpty(),
    body('chapterId').optional(),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, content, chapterId } = req.body

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const excerpt = content.replace(/<[^>]*>/g, '').substring(0, 200)

    const noteData: any = {
      title,
      content,
      slug,
      excerpt,
      user: { connect: { id: PUBLIC_USER_ID } },
    }
    if (chapterId) {
      noteData.chapter = { connect: { id: chapterId } }
    }

    const note = await client.note.create({ data: noteData })
    res.status(201).json(note)
  })
)

router.put(
  '/:id',
  [
    body('title').notEmpty().trim(),
    body('content').notEmpty(),
    body('isPublished').optional(),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = req.params
    const { title, content, isPublished } = req.body

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const excerpt = content.replace(/<[^>]*>/g, '').substring(0, 200)

    const note = await client.note.update({
      where: { id, userId: PUBLIC_USER_ID },
      data: {
        title,
        content,
        slug,
        excerpt,
        isPublished: isPublished ?? undefined,
      },
    })
    res.json(note)
  })
)

router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    await client.note.delete({ where: { id, userId: PUBLIC_USER_ID } })
    res.status(204).send()
  })
)

export default router
