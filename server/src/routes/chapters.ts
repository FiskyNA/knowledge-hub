import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { client } from '../lib/prisma'
import { asyncHandler } from '../middleware/auth'
import { PUBLIC_USER_ID } from '../config'

const router = Router()

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { subjectId } = req.query

    const where: any = {}
    if (subjectId) {
      const subject = await client.subject.findFirst({
        where: { id: subjectId as string, userId: PUBLIC_USER_ID },
      })
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' })
      }
      where.subjectId = subjectId as string
    } else {
      // No subjectId — return chapters for all user's subjects
      const userSubjects = await client.subject.findMany({
        where: { userId: PUBLIC_USER_ID },
        select: { id: true },
      })
      where.subjectId = { in: userSubjects.map((s) => s.id) }
    }

    const chapters = await client.chapter.findMany({
      where,
      orderBy: { order: 'asc' },
      include: { notes: true, files: true },
    })
    res.json(chapters)
  })
)

router.post(
  '/',
  [
    body('name').notEmpty().trim(),
    body('description').optional(),
    body('subjectId').notEmpty(),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, description, subjectId } = req.body

    const subject = await client.subject.findUnique({
      where: { id: subjectId, userId: PUBLIC_USER_ID },
    })
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' })
    }

    const order = await client.chapter.count({ where: { subjectId } })

    const chapter = await client.chapter.create({
      data: { name, description, order, subjectId },
    })
    res.status(201).json(chapter)
  })
)

router.put(
  '/:id',
  [
    body('name').notEmpty().trim(),
    body('description').optional(),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = req.params
    const { name, description } = req.body

    const chapter = await client.chapter.update({
      where: { id },
      data: { name, description },
    })
    res.json(chapter)
  })
)

router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    await client.chapter.delete({ where: { id } })
    res.status(204).send()
  })
)

export default router
